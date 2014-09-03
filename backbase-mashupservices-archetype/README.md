# Archetype backbase-mashupservices-archetype

Version **5.5.0.0**

##Overview
This archetype allows you to run as standalone and customize according to your specific needs Backbase Mashup Services. We are basically creating a standard Maven WAR overlay of Backbase Mashup Services WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

Backbase Mashup Services is not using database, therefore no database configurations are supplied.

The reason why you would want to use standalone Mashup Services and therefore use this archetype is if you want to run this module in a standalone JVM separate from Portal Foundation.

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Mashup Services Stand-Alone](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_mash). You should get familiar with these topics before you start using this archetype.

1. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
	<pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-mashupservices-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.5.0.0
    </pre>
Refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) for more information.  
2. Optionally adjust JMV properties, differently configure the logback, or make some changes to one or more of the following configuration files:
    - main configuration file (backbase.properties),
    - Mashup Services configuration file (ptc-config.xml),
    - ICE configuration file (ice-config.properties).
For any of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Mashup Services Stand-Alone](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_mash).  
3. Use the following command to prepare the project for running:
    <pre>
    $ mvn clean package
    </pre>
If you want to run Mashup Services on Jetty:  
    <pre>
    $ mvn jetty:run
    </pre>
Or, if you want to run Mashup Services on Tomcat 7:
    <pre>
    $ mvn tomcat7:run
    </pre>
Note that both Jetty and Tomcat use the 8082 port by default. In case you need to choose a different port since you maybe already have another process running on port 8082, make necessary changes in jetty and tomcat plugins within POM file before you run Mashup Services.  
4. Test Mashup Services by opening the Mashup Services RSS pipe URL in a browser: [http://localhost:8082/mashupservices-webapp/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/](http://localhost:8082/mashupservices-webapp/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/) (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.  
5. In order to integrate Mashup Services with your Portal Foundation that is running in its own standalone process, make sure to configure all the Portal Foundation and Mashup Services inter-related configurations. In order to do that, you need to modify a PTC profile in backbase.properties of your portal and to set Portal Foundation URL as a JVM property. On top of that you need to adjust ice-config.properties with the correct Portal Foundation URL. All of this is explained in [Proxy Configuration](https://my.backbase.com/resources/documentation/portal/inst_conf.html#inst_conf_prox).  

##Anatomy
**project**  
-**configuration**  
--**jetty**  
---jetty.xml --> Jetty JNDI bindings for Mashup Services web application defined with this Maven project  
---webdefaults.xml --> Global Jetty configuration  
--**tomcat**  
---context.xml --> Tomcat 7 JNDI bindings for Mashup Services web application defined with this Maven project  
---server.xml --> Tomcat 7 server configuration  
--backbase.properties --> Main Backbase configuration file  
--ice-config.properties --> Ice Data Provider configuration file  
--logback.xml --> Logback configuration file  
--ptc-config.properties --> Mashup Services configuration properties file  
--ptc-config.xml --> Mashup Services main configuration file  
-**src**  
--**main**  
---**java**  
---**resources**  
----backbase-ptc.xml --> Mashup Services Spring Beans configuration file  
---**webapp**  
----**static**  
-----**RSS**  
------**xsl**  
-------rss2html.xsl --> RSS 2 HTML XSL file  
------rss-example-feed.xml  
----version.txt --> Build version info file  
----**WEB-INF**  
-----**web.xml**  
--**test**  
---**java**  
----**com**  
-----**backbase**  
------**test**  
-------**mashupservices**  
--------InstallationValidationTestST.java --> Test used to validate Mashup Services on embedded server  
---**resources**  
-build.bat  
-build.sh  
-pom.xml  
-start.bat  
-start.sh  
