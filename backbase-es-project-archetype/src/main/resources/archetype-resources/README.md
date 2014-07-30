# Project README
Make sure to follow the next steps in order to setup this project locally.

----
## 1. Perform build of all the modules 
This can be done by running script **install-all** or by manually entering the following Maven commands:

    mvn clean install -P full        

## 2. Prepare required modules
Next step is to prepare required modules for your local development:
* contentservices
* orchestrator
* portal

Each module has a default **prepare** script supplied with that needs to be run.

## 3. Run required modules
Next step is to run required modules for your local development. Runnable modules are:
* contentservices
* orchestrator
* portal

Each runnable module has a default **start** script supplied with and you need to run it per need.

----
## Module descriptions
Here is list if all Maven modules together with its description:
* **configuration** contains all project configurations.
* **contentservices** is customized **contentservices** module able to run as standalone service.
* **dist** produces distribution of all modules.
* **orchestrator** is customized **orchestrator* module able to run as standalone service.
* **portal** is backbase portal module.
* **services** is parent module for all Integration services.
* **statics** is parent module for all web static assets packaged as Backbase bundles.
