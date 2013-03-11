# Archetype backbase-contentservices-archetype

##Overview
A blank Maven archetype for the Backbase Portal Content Services. We're basically creating a standard Maven WAR overlay of Backbase Content Services WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

##Usage
The only reason why you would want to create your own version of Content Services and therefore use this archetype is if you really need to modify it from within.  

Most common reason for modification from within is creation of custom CMIS content types and this is covered in some of the Backbase Dev Guides on [my.backbase.com](http://my.backbase.com).

##Anatomy
**project**  
-**configuration**  
--**contentservices** --> optional example files that can be used with Content Services  
---**contentRepository**  
----**importers**  
-----**cmis**  
------alfresco.properties --> example CMIS importer configuration  
-----**feed**  
------BloombergBlog.properties --> example RSS importer configuration  
----**scheduler**  
-----**job**  
------myjob.properties --> example schedule rjob configuration  
--**jetty**  
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration  
--**scripts**  
---**contentservices** --> content services database scripts for all databases we support    
--**tomcat**  
---context.xml --> tomcat 7 context configuration  
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file   
--logback.xml --> logback configuration file   
-**data** --> working folder for local storage, such as H2 database files, orchestrator and import/export work packages and so on  
-**src**  
--**main**  
---**java**
---**resources**   
----**META-INF**  
-----**meta-model** --> folder where custom CMIS models would go   
-----**spring** --> folder where custom spring configurations would go    
---**webapp**    
--**test**  
---**java**   
----**my**  
-----**company**  
------**contentservices**  
-------InstallationValidationTestST.java --> Test used to validate build on embedded server  
---**resources**  
-pom.xml  
