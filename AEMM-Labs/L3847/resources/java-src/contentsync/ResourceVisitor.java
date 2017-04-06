package we.mix.impl.contentsync;

import org.apache.sling.api.resource.Resource;

import java.util.Iterator;

/**
 * The <code>ResourceVisitor</code> helps in traversing a resource
 * tree by decoupling the actual traversal and the code actually
 * doing something with the resources. Concrete subclasses should
 * implement the {@link ResourceVisitor#accept(Resource)} method.
 */
public abstract class ResourceVisitor {

	/**
	 * Visit the given resource and all its descendants.
	 * @param res	The resource
	 */
	public void visit(Resource res) {
		if(res != null) {
			accept(res);
			traverseChildren(res.listChildren());
		}
	}
	
	/**
	 * Visit the given resources and all its descendants.
	 * @param children	The list of resources
	 */
	private void traverseChildren(Iterator<Resource> children) {
		while(children.hasNext()) {
			Resource child = children.next();
			accept(child);
			traverseChildren(child.listChildren());
		}
	}
	
	/**
	 * Implement this method to do actual work on the resources.
	 * @param res	The resource
	 */
	protected abstract void accept(Resource res);
}
