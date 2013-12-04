# Archetype backbase-mashupservices-archetype

Version **5.4.2.2**

##Overview
This archetype allows you to customize Backbase Mashup Services according to your specific needs. We are basically creating a standard Maven WAR overlay of Standalone Backbase Mashup Services WAR. More info on how WAR overlay works you can find [here](http://maven.apache.org/plugins/maven-war-plugin/overlays.html).

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

Backbase Mashup Services is not using database, therefore no database configurations are supplied.

The reason why you would want to create your own version of Mashup Services and therefore use this archetype is if you need to use Standalone Mashup Services and develop customizations on top of it. Most common reason for customizations is creation of custom filters, data providers and transformers and this is covered in [Developing for Mashup Services](https://my.backbase.com/doc-center/manuals/portal/devd_cuma.html) part of Mashup Services documentation. 

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Mashup Services](https://my.backbase.com/doc-center/manuals/portal/inst_inst_ptc.html). You should get familiar with these topics before you start using this archetype.

1. Configure your Maven installation to include the Backbase extensions repository by editing the settings.xml file located in the .m2 folder. 
    <pre>```    
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <profiles>
            <profile>
                <id>backbase</id>
                <activation>
                    <activeByDefault>true</activeByDefault>
                </activation>
                <repositories>
                    <repository>
                        <id>Backbase Artifact Repository</id>
                        <url>https://repo.backbase.com/repo/</url>
                    </repository>
                    <repository>
                        <id>Backbase Extensions Repository</id>
                        <url>https://repo.backbase.com/extensions/</url>
                    </repository>
                </repositories>
            </profile>
        </profiles>
        <servers>
            <server>
                <id>Backbase Artifact Repository</id>
                <!--Please change your_user_name and your_password below-->
                <username>your_user_name</username>
                <password>your_password</password>
            </server>
            <server>
                <id>Backbase Extensions Repository</id>
                <!--Please change your_user_name and your_password below-->
                <username>your_user_name</username>
                <password>your_password</password>
            </server>
        </servers>
    </settings>
    ```</pre>
2. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
	<pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-mashupservices-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.4.2.2
    </pre>
Refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) for more information. 
3. Optionally adjust JMV properties, differently configure the logback, or make some changes to one or more of the following configuration files:
    - main configuration file (backbase.properties),
    - Mashup Services configuration file (ptc-config.xml),
    - ICE configuration file (ice-config.properties).
For any of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Mashup Services](https://my.backbase.com/doc-center/manuals/portal/inst_inst_ptc.html).
4. Use the following command to prepare the project for running:
    <pre>
    $ mvn clean install
    </pre>
If you want to run Mashup Services on Jetty:  
    <pre>
    $ mvn jetty:run-war
    </pre>
Or, if you want to run Mashup Services on Tomcat 7:
    <pre>
    $ mvn tomcat7:run-war
    </pre>
Note that both Jetty and Tomcat use the 8082 port by default. In case you need to choose a different port since you maybe already have another process runing on port 8082, make necessary changes in jetty and tomcat plugins within POM file before you run Mashup Services.
5. Test Mashup Services by opening the Mashup Services RSS pipe URL in a browser: http://localhost:8082/mashupservices-webapp/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/ (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.
6. In order to integrate Mashup Services with your Backbase Portal that is running in its own standalone process, make sure to configure all the Portal and Mashup Services inter-related configurations. In order to do that, you need to modify a PTC profile in backbase.properties of your portal and to set Portal Foundation URL as a JVM property. On top of that you need to adjust ice-config.properties with the correct Portal URL. All of this is explained in [Proxy Configuration](https://my.backbase.com/doc-center/manuals/portal/inst_inst_configfiles.html#inst_inst_proxyconfig).

##Anatomy
**project**  
-**configuration**  
--**jetty**  
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration     
--**tomcat**  
---context.xml --> tomcat 7 JNDI bindings for portal web application defined with this Maven project   
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file  
--ice-config.properties --> Ice Data Provider configuration file   
--logback.xml --> logback configuration file  
--ptc-config.properties --> Mashup Services configuration properties file  
--ptc-config.xml --> Mashup Services main configuration file    
-**src**  
--**main**  
---**java**  
---**resources**   
---**webapp**    
----**static**  
-----**RSS**  
------**xsl**  
-------rss2html.xsl --> RSS 2 HTML XSL file  
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
-pom.xml  
