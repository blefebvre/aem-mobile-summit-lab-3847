package we.mix.impl.contentsync;

import com.day.cq.contentsync.config.ConfigEntry;
import com.day.cq.contentsync.handler.AbstractSlingResourceUpdateHandler;
import com.day.cq.contentsync.handler.ContentUpdateHandler;
import com.day.cq.wcm.foundation.Image;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.commons.osgi.OsgiUtil;
import org.osgi.service.component.ComponentContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.util.Calendar;

/**
 * ContentSync Handler to export images used in by a CaaS site page reference.
 */
@Component(
        metatype = true,
        factory = "com.day.cq.contentsync.handler.ContentUpdateHandler/wemix",
        label = "WeMix Site Page Image Export Handler",
        description = "WeMix Site Page Image Export Handler"
)
public class NewsUpdateHandler extends AbstractSlingResourceUpdateHandler implements ContentUpdateHandler {

    /**
     * Logger
     */
    private static final Logger log = LoggerFactory.getLogger(NewsUpdateHandler.class);

    /**
     * Image rendering selector
     */
    private static final String DEFAULT_IMAGE_SELECTOR = ".img";

    /**
     * Image types to export
     */
    @Property(value = {"wcm/foundation/components/image", "foundation/components/image", "we-mix/components/content/heroimage"}, cardinality = Integer.MAX_VALUE)
    private static final String IMAGE_RESOURCE_TYPES = "wemix.export.imageresourcetypes";
    private String[] imageResourceTypes;

    @Activate
    protected void activate(ComponentContext context) {
        imageResourceTypes = OsgiUtil.toStringArray(context.getProperties().get(IMAGE_RESOURCE_TYPES));
    }

    /**
     * Implement interface com.day.cq.contentsync.handler.ContentUpdateHandler
     */
    public boolean updateCacheEntry(ConfigEntry configEntry, Long lastUpdated, String configCacheRoot, Session admin, Session session) {
        try {
            boolean changed = false;
            ResourceResolver resolver = resolverFactory.getResourceResolver(session);
            Resource rootResource = resolver.getResource(configEntry.getContentPath());

            log.debug("Executing config " + configEntry.getPath());
            log.info("Executing over content path " + configEntry.getContentPath());

            changed = exportImages(rootResource, configCacheRoot, admin, session, lastUpdated) || changed;

            return changed;
        } catch (Exception ex) {
            log.error("Unexpected error while updating cache for config: " + configEntry.getPath(), ex);
        }

        return false;
    }

    /**
     * Export images
     *
     * @param resource
     * @param configCacheRoot
     * @param admin
     * @param session
     * @return true if ContentSync cache was updated, false otherwise
     * @throws RepositoryException
     */
    private boolean exportImages(Resource resource, String configCacheRoot, Session admin, Session session, Long lastUpdated) throws RepositoryException {
        ComponentVisitor visitor = new ComponentVisitor(configCacheRoot, admin, session, lastUpdated);
        visitor.visit(resource);
        return visitor.cacheUpdated();
    }

    /**
     * Traverse respository looking for images to export.
     */
    private class ComponentVisitor extends ResourceVisitor {
        private String configCacheRoot;
        private Session admin;
        private Session session;
        private boolean cacheUpdated = false;
        private Long lastUpdated = null;

        ComponentVisitor(String configCacheRoot, Session admin, Session session, Long lastUpdated) {
            this.configCacheRoot = configCacheRoot;
            this.admin = admin;
            this.session = session;
            this.lastUpdated = lastUpdated;
        }

        protected void accept(Resource res) {
            try {
                if (isA(res, imageResourceTypes)) {
                    Image image = new Image(res);
                    image.setSelector(DEFAULT_IMAGE_SELECTOR);
                    String imageHREF = image.getPath() + image.getSelector() + image.getExtension(); // No suffix, not using cache buster in file name
                    if(isModified(image, imageHREF, lastUpdated)) {
                        log.debug("Image check passed for resource " + res.getPath());
                        exportImageResource(imageHREF);
                    } else {
                        log.debug("Image check passed for resource, but not modified " + res.getPath());
                    }
                } else {
                    log.debug("Image check failed for resource " + res.getPath());
                }
            } catch (Exception e) {
                log.error("Updating page dependencies failed: ", e);
            }
        }

        /**
         * Export the image to the ContentSync cache
         * @param imageHREF
         */
        private void exportImageResource(String imageHREF) {
            try {
                cacheUpdated =  renderResource(imageHREF, configCacheRoot, admin, session) || cacheUpdated;
            } catch (Exception e) {
                log.error("Rendering image resource failed: ", e);
            }
        }

        protected boolean isModified(Resource resource, String uri, Long lastUpdated) throws RepositoryException {
            boolean modified = false;

            if(!session.nodeExists(configCacheRoot + uri)) {
                return true;
            }

            Calendar cal = resource.getValueMap().get("jcr:lastModified", Calendar.class);
            if (cal == null) {
                modified = true;
            } else {
                long lastModified = cal.getTime().getTime();
                modified = (lastUpdated < lastModified || lastModified == -1);
            }

            return modified;
        }

        /**
         * Check if resource is in the list of exportable types
         *
         * @param resource
         * @param resourceTypes
         * @return true matches search type, false otherwise
         */
        private boolean isA(Resource resource, String[] resourceTypes) {
            for (String type : resourceTypes) {
                if (ResourceUtil.isA(resource, type)) {
                    log.debug("Resource was an image of type " + type + " for " + resource.getPath());
                    return true;
                }
            }
            log.debug("Resource was NOT an image of type " + resource.getResourceType() + " for " + resource.getPath());
            return false;
        }

        /**
         * @return true if cache was updated during processing
         */
        protected boolean cacheUpdated(){
            return cacheUpdated;
        }
    }
}
