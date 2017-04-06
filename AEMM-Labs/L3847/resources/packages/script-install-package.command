#! /bin/bash

clear

echo "********************************************************************************"
echo "*****    Installing Final Summit Lab 3847 AEM Packages to Author Instance..."
echo "********************************************************************************"

cd `dirname $0`
curl -u admin:admin -F file=@we.mix.content-1.0-SNAPSHOT.zip -F name=we.mix.content-1.0-SNAPSHOT -F force=true -F install=true http://localhost:4502/crx/packmgr/service.jsp
curl -u admin:admin -F file=@we.mix.content.app-1.0-SNAPSHOT.zip -F name=we.mix.content.app-1.0-SNAPSHOT -F force=true -F install=true http://localhost:4502/crx/packmgr/service.jsp

echo "********************************************************************************"
echo "*****    Installing Final Summit Lab 3847 AEM Packages to Publish Instance..."
echo "********************************************************************************"

curl -u admin:admin -F file=@we.mix.content.app-1.0-SNAPSHOT.zip -F name=we.mix.content.app-1.0-SNAPSHOT -F force=true -F install=true http://localhost:4503/crx/packmgr/service.jsp

echo "********************************************************************************"
echo "*****    Installing Custom Dashboard to Author Instance..."
echo "********************************************************************************"

curl -u admin:admin -F file=@custom-dashboard-content-1.0-SNAPSHOT.zip -F name=custom-dashboard-content-1.0-SNAPSHOT.zip -F force=true -F install=true http://localhost:4502/crx/packmgr/service.jsp
