# backbase-portal-archetype-all-in-one Archetype

##Overview
A blank Maven archetype for the Backbase Portal server running on a single JVM instance. This archetype contains integrated Mashup Services, Content Services and Orchestrator with necessery configuration files already pre-configured.

This archetype enables all-in-one setup for local development. Focus of this archetype is on demonstartion of how to configure Content Services and Orchestrator to run along Backbase Portal on same JVM process of server of your choice. Currently in Maven we have pre-configured Jetty and Tomcat 7. One can easily swicth from tomcat 7 to Tomcat 6 in single line within POM file. 

Default database stays H2 and basic developemnt guide already instructs on how to move to a database of your choice if required.

Content Services are pre-configured and ready to use frokm within Portal Manager.

Orchestrator is pre-configured for self-publishing. More info within orchestrator configuration file which is located inside configuration folder.

##Folder Structure
TODO