# Archetype backbase-portal-archetype-basic

Version **5.4.1.3**

##Overview
A blank Maven archetype for the Backbase Portal Foundation. This archetype contains integrated Mashup Services and Targeting with all necessery configuration files already pre-configured.

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

H2 is the default database. Refer to the reference documentation for full details on how to [move to a database of your choice if required](https://my.backbase.com/doc-center/manuals/portal/inst_inst_cose.html#inst_inst_cs_database).

Mahup Services are pre-configured together with example RSS pipe.

Targeting is pre-configured together with example WeatherCollector.

Difference between this archetype and one that ships with the product is minor and changes are there to make it be a part of Expert Services famility of archetypes. 

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Portal Foundation](https://my.backbase.com/doc-center/manuals/portal/inst_pofo.html). You should get familiar with these topics before you start using this archetype.

1. Configure your Maven installation to include the Backbase extensions repository by editing the settings.xml file located in the .m2 folder. 
    <pre>```    
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <profiles>
            <profile>
                <id>backbase</id>
                <activation>
                    <activebydefault>true</activebydefault>
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
        -DarchetypeArtifactId=backbase-portal-archetype-basic
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.4.1.3
    </pre>
Refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) for more information. 
3. Optionally adjust JMV properties, differently configure the logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Backbase Development Setup](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) or [Install Portal Foundation](https://my.backbase.com/doc-center/manuals/portal/inst_pofo.html).
4. Use the following command to prepare the project for running.
    <pre>
    $ mvn clean install -P create-database
    </pre>
If you want to run Portal Foundation on Jetty:  
    <pre>
    $ mvn jetty:run-war
    </pre>
Or, if you want to run Portal Foundation on Tomcat 7:
    <pre>
    $ mvn tomcat7:run-war
    </pre>
Optionally run following command to delete and re-create databases when required:
    <pre>
    $ mvn clean -P clean-database
    </pre>
Note that both Jetty and Tomcat use the 8080 port by default. In case you need to choose a different port since you maybe already have another process runing on port 8080, make necessary changes in jetty and tomcat plugins within POM file before you run Portal Foundation.
5. Test Portal Foundation by opening the Portal Foundation URL in a browser: http://localhost:8080/portalserver/ (pay attention to the port number).
6. Test Mashup Services by opening the Mashup Services RSS pipe URL in a browser: http://localhost:8080/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/ (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.
7. In order to integrate Portal Foundation with your Content Services that is running in its own standalone process, make sure to configure Portal’s Content Services Proxy within backbase.properties as it is explained in [Proxy Configuration](https://my.backbase.com/doc-center/manuals/portal/inst_inst_configfiles.html#inst_inst_proxyconfig).
8. In order to integrate Portal Foundation with your Orchestrator that is running in its own standalone process, make sure to configure Portal’s Orchestrator and Orchestrator Proxy within backbase.properties as it is explained in [Orchestrator](https://my.backbase.com/doc-center/manuals/portal/inst_publ.html) and [Proxy Configuration](https://my.backbase.com/doc-center/manuals/portal/inst_inst_configfiles.html#inst_inst_proxyconfig).

##Anatomy
**project**  
-**configuration**    
--**jetty**  
---jetty.xml --> jetty JNDI bindings for portal web application defined with this Maven project  
---webdefaults.xml --> jetty configuration  
--**scripts**   
---**foundation** --> portal foundation database scripts for all databases we support   
---**manager** --> portal manager scripts   
---**tracking** --> tracking database scripts for all databases we support  
--**tomcat**  
---context.xml --> tomcat 7 JNDI bindings for portal web application defined with this Maven project  
---server.xml --> tomcat 7 server configuration  
--backbase.properties --> main backbase configuration file  
--ice-config.properties --> backbase ICE configuration file  
--logback.xml --> logback configuration file  
--ptc-config.properties --> Mashup Services configuration properties file  
--ptc-config.xml --> Mashup Services main configuration file      
-**src**  
--**main**  
---**coreResources**  
----**import**  
-----importPortal.xml --> backbase portal import file for portal without portal manager  
---**dashboardResources**  
----**import**  
-----importPortal.xml --> backbase portal import file for portal with portal manager  
---**java**  
----**com**  
-----**backbase**  
------**targeting**  
-------**collector**  
--------**examples**  
---------WeatherContextCollector.java --> target collector example  
---**resources**  
----**import**  
-----importPortal.xml --> copy of one from dashboardResources/import  
----**META-INF**  
-----**spring**  
------**optional**  
-------targeting-connectorframework.xml --> spring configuration for targeting that refers to targetimng example  
------backbase-portal-application-config.xml --> spring configuration suitable to hook custom spring configurations  
------backbase-portal-integration-config.xml --> spring configuration suitable to hook custom spring configurations  
---**webapp**  
----**static**  
-----**default**  
------**css**  
-------backbaseportalserver.css  
------**media**  
-------BB_logo_.png  
-------bb_ribbon.png  
-------bg_pm.png  
-----**lib**  
------jquery-1.6.1-min.js  
-----**RSS**  
------**xsl**  
-------rss2html.xsl  
----**WEB-INF**  
-----**default** --> default backbase templates  
------borderlayout.jsp  
------container.jsp  
------link.jsp  
------page.jsp  
------widget.jsp  
-----**import**  
------chooseImport.jsp --> import portal page  
-----ehcache_statistics.jsp --> eh cache statistics page  
-----hibernate_statistics.jsp --> hibernate statistics page  
-----ibm-web-ext.xmi --> IBM WAS specific configuration file  
-----index.jsp  
-----jboss-deployment-structure.xml --> JBoss deployment specific configuration file  
-----jboss-web.xml--> JBoss specific configuration file  
-----portal.tld --> portal's TLD  
-----web.xml  
--**test**  
---**java**   
----**com**  
-----**backbase**  
------**test**  
-------**mashupservices**  
--------InstallationValidationTestST.java --> Test used to validate embedded Mashup Services on embedded server    
-------**portalserver**  
--------InstallationValidationTestST.java --> Test used to validate Portal Foundation on embedded server  
---**resources**  
-**tools** --> various tools  
-pom.xml  
