# Adobe Summit 2017 - Lab 3847

## Unleash your mobile app experience with developer customizations 

This repository contains all the necessary content (excluding AEM 6.3) for running through the above lab on your own hardware.


### Before you begin

You will need:

- the [PhoneGap CLI](http://docs.phonegap.com/references/phonegap-cli/) (and its dependencies)
- the [PhoneGap Developer App](http://docs.phonegap.com/getting-started/2-install-mobile-app/) installed on an iOS or Android device
	- note: the step in the workbook which builds and installs the PhoneGap Dev App from source is not necessary (and will not work since the source has been removed) - use your own device instead

Once your AEM 6.3 author and publish instances are running:

- run `AEMM-Labs/L3847/resources/packages/script-install-package.command`
	- this will install the provided AEM content packages onto your local instances, assuming they are running on `:4502` and `:4503` respectively 
	- if you do not have an OS X machine, you can install each of the packages in `AEMM-Labs/L3847/resources/packages/` onto your AEM author instance, and replicate them to publish

Optionally: 

- place the included `AEMM-Labs` directory onto your Desktop
	- this is optional, but it makes the paths in the workbook correct


### Workbook

Can be found here: [AEMM-Labs/L3847/L3847_LABBOOK.docx](AEMM-Labs/L3847/L3847_LABBOOK.docx)

Please file any issues with the material as a Github issue on this project. Thank you!

