# backbase-portal-archetype-all-in-one Archetype

##Overview
A blank Maven archetype for the Backbase Portal server running on a single JVM instance. This one contains integrated Mashup Services, Content Services and Orchestrator with necessery configuration files already there.

This archetype enables all-in-one setup for local development. Focus of this archetype is on demonstartion of how to configure Content Services and Orchestrator to run along Backbase Portal on same JVM instance of server of your choice. Currently in Maven we have pre-configured Jetty and Tomcat 7.

Default database stays H2 and basic developemnt guide alreasy instructs on how to move to a database of your choice.

Content Services are preconfigured and ready to use frokm within Portal Manager.

Orchestrator is preconfigured for self-publishing. More info within orchestrator configuration file inside configuration fodler.

##Folder Structure
TODO