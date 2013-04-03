# Archetype backbase-mashupservices-archetype

Version **5.4.0.6**

##Overview
A blank Maven archetype for the Backbase Portal Standalone Mashup Services. We are basically creating a standard Maven WAR overlay of Standalone Backbase Mashup Services WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

##Usage
Reason why you would want to create your own version of Standalone Mashup Services and therefore use this archetype is if you want to add any custom code to it which ussualy is the reason if you;re using Mashup Services. This is covered in Mashup Services documentaion within section Customization on [https://my.backbase.com/doc-center/manuals/portal/mash_cust.html](https://my.backbase.com/doc-center/manuals/portal/mash_cust.html). 

Follow next steps to start with this archetype. Note that some of these steps refer to [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html). This means that you should first familiarize yourself with Portal Development process in general before you start using this archetype.

1. Setup Maven. For more information look at [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html), section 9.1, step 1. 
2. Generate project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
	<pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-mashupservices-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.4.0.6
    </pre>
For more information look at [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html), section 9.1, step 2. 
3. As-is.
4. As-is.
5. Logback configuration is already pre-configured and configuration file for it is located within a configuration subfolder of your project root folder. 
6. Properties configuration file backbase.properties is already pre-configured and it is located in a configuration subfolder of your project root folder.
7. Environment entries are already defined within Jetty and Tomcat configuration files that are located inside the configuration/jetty and configuration/tomcat subfolders of your project root folder.
8. Not applicable.
9. Pre-configured for 1.6.
10. Not applicable.
11. Not applicable.
12. Not applicable.
13. Not applicable.

#####9.1.1 Database setup (optional)
Not applicable.

#####9.1.2 Portal Example
Not applicable.

#####9.1.3 Test

Following steps are replacing/complementing 4 steps described in this section.

1. Use the following commands instead. 

This ones prepares Portal for running:  
    
    $ mvn clean install

Then, if you want run Portal on Jetty:

    $ mvn jetty:run-war

OR 

If you want to run Portal on Tomcat 7:

    $ mvn tomcat7:run-war

Optionally run following command to delete and re-create databases when required:

    $ mvn clean

Both Jetty and Tomcat use 8080 ports.

2. As-is.
3. As-is.
4. As-is.

####9.2 Targeting
Not applicable.

####9.3 Maven Settings File
As-is.

##Anatomy
**project**  
-**configuration**  
--**jetty**  
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration     
--**tomcat**  
---context.xml --> tomcat 7 context configuration  
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file   
--logback.xml --> logback configuration file 
--ptc-config.xml --> Mashup Services configuration file  
--ptc-server.properties --> Mashup Services properties file   
-**src**  
--**main**  
---**java**
---**resources**     
---**webapp** 
----**static**
-----**RSS**
------**xsl** 
-------rss2html.xsl --> RSS 2 HTML XSL file 
--**test**  
---**java**   
----**my**  
-----**company**  
------**mashupservices**  
-------InstallationValidationTestST.java --> Test used to validate build on embedded server  
---**resources**  
-pom.xml  
