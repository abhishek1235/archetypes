# Archetype backbase-portalserver-archetype

Version **5.5.1.0**

##Overview
A blank Maven archetype for the Backbase Portal Foundation. This archetype contains integrated Mashup Services and Targeting (default configuration) with all necessery configuration files already pre-configured.

The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. It also contains all necessery scripts and configuration files required for forther configuration changes. 

H2 is the default database. Refer to the reference documentation for full details on how to [move to a database of your choice if required](https://my.backbase.com/resources/documentation/portal/inst_data.html).

Mashup Services are pre-configured together with example RSS pipe.

Targeting is pre-configured together with example WeatherCollector.

Difference between this archetype and one that ships with the product is minor and changes are there to make it be a part of Backbase Expert Services famility of archetypes.

##Usage
Follow the steps below to get started with this archetype. Some of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Portal Foundation](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_pofo). You should get familiar with these topics before you start using this archetype.

1. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-portalserver-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.5.1.0
    </pre>
Refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) for more information.  
2. Optionally adjust JMV properties, differently configure the logback, or make some changes to main configuration file (backbase.properties). For any of these steps refer to [Development Setup](https://my.backbase.com/resources/documentation/portal/devd_mave.html) or [Install Portal Foundation](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_pofo).  
3. Use the following command to prepare the project for running.
    <pre>
    $ mvn clean package -P create-database
    </pre>
If you want to run Portal Foundation on Jetty:  
    <pre>
    $ mvn jetty:run
    </pre>
Or, if you want to run Portal Foundation on Tomcat 7:
    <pre>
    $ mvn tomcat7:run
    </pre>
Optionally run following command to delete and re-create databases when required:
    <pre>
    $ mvn clean -P clean-database
    </pre>
Note that both Jetty and Tomcat use the 7777 port by default. In case you need to choose a different port since you maybe already have another process runing on port 7777, make necessary changes in jetty and tomcat plugins within POM file before you run Portal Foundation.  
4. Test Portal Foundation by opening the Portal Foundation URL in a browser: [http://localhost:7777/portalserver/](http://localhost:7777/portalserver/) (pay attention to the port number).  
5. Test embedded Mashup Services by opening the Mashup Services RSS pipe URL in a browser: [http://localhost:7777/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/](http://localhost:7777/portalserver/proxy?pipe=rss&url=http://blog.bloomberg.com/feed/) (pay attention to the port number). Existing RSS pipe fetches RSS feed from url parameter and then applies XSLT transformation to create a snippet of HTML that can be used from some widget for example.  
6. In order to integrate Portal Foundation with your Content Services that is running in its own standalone process, make sure to configure Portal’s Content Services Proxy within backbase.properties as it is explained in [Proxy Configuration](https://my.backbase.com/resources/documentation/portal/inst_conf.html#inst_conf_prox).  
7. In order to integrate Portal Foundation with your Orchestrator that is running in its own standalone process, make sure to configure Portal’s Orchestrator and Orchestrator Proxy within backbase.properties as it is explained in [Install Publishing](https://my.backbase.com/resources/documentation/portal/inst_tcat.html#inst_tcat_orch) and [Proxy Configuration](https://my.backbase.com/resources/documentation/portal/inst_conf.html#inst_conf_prox).  

##Anatomy
**project**  
-**configuration**  
--**jetty**  
---jetty.xml --> Jetty JNDI bindings for Portal Foundation web application defined with this Maven project  
---webdefaults.xml --> global Jetty configuration  
--**scripts**  
---**foundation** --> Portal Foundation database scripts for all databases we support  
---**manager** --> Portal Manager scripts  
---**tracking** --> Tracking database scripts for all databases we support  
--**tomcat**  
---context.xml --> Tomcat 7 JNDI bindings for Portal Foundation web application defined with this Maven project  
---server.xml --> Tomcat 7 server configuration  
--backbase.properties --> Main Backbase configuration file  
--deviceConfig.xml --> Backbase Portal Manager devices configuration  
--esapi.properties --> Backbase ESAPI configuration file  
--ice-config.properties --> Backbase ICE configuration file  
--logback.xml --> Logback configuration file  
--ptc-config.properties --> Mashup Services configuration properties file  
--ptc-config.xml --> Mashup Services main configuration file  
--service-config.xml --> Optional Services configuration file  
-**data** --> Folder where all local data is stored  
-**src**  
--**main**  
---**config-info**  --> Backbase components configuration files  
----**import**  --> YAPI import configuration files  
-----**samples**  --> Samples bundle YAPI import configuration files  
------**widgets**  
-----mycomp-myportal.xml  
-----mycomp-myportal-inst-mypage.xml  
-----mycomp-myportal-mapg-mymaster.xml  
-----mycomp-myportal-pc-conts.xml  
-----mycomp-myportal-pc-wdgs.xml  
-----mycomp-myportal-pgs-login.xml  
-----mycomp-myportal-pgs-mypage.xml  
-----mycomp-myportal-root-links.xml  
-----mycomp-sc-cont-myContainer.xml  
-----mycomp-sc-conts.xml  
-----mycomp-sc-wdg-sample.xml  
-----mycomp-sc-wdgts.xml  
-----mycomp-tmps-conts.xml  
-----mycomp-tmps-pgs.xml  
-----mycomp-users.xml  
---**coreResources**  
----**import**  
-----importPortal.xml --> Backbase import file for portal without portal manager  
---**dashboardResources**  
----**import**  
-----importPortal.xml --> Backbase import file for portal with portal manager  
---**java**  
----**com**  
-----**backbase**  
------**targeting**  
-------**collector**  
--------**examples**  
---------WeatherContextCollector.java --> Targeting collector example  
---**resources**  
----**conf**  
-----uiEditingOptions.js --> Backbase Portal Manager UI editing options configurations  
----**import**  
-----importPortal.xml --> copy of one from dashboardResources/import  
----**META-INF**  
-----**spring**  
------**optional**  
-------targeting-connectorframework.xml --> Spring configuration for Targeting that refers to collector example  
------backbase-portal-application-config.xml --> Spring configuration suitable to hook custom Spring configurations  
------backbase-portal-business-security.xml --> Main Spring Security configurations  
------backbase-portal-integration-config.xml --> Spring configuration suitable to hook custom Spring configurations  
------backbase-portal-presentation-config.xml --> Main Spring MVC configurations  
------backbase-portal-presentation-security.xml --> Spring Security presentation configurations  
----backbase-ptc.xml --> Mashup Services Spring Beans configuration file  
----ehcache-auditing.xml --> Ehcache Portal Audit configurations  
----ehcache-foundation.xml --> Ehcache Portal Foundation configurations  
----ehcache-foundation-jgroups-example.xml --> Ehcache Portal Foundation configurations with JGroups enabled  
----ehcache-persistence.xml --> Ehcache Portal Foundation persistence configurations  
----ehcache-persistence-jgroups-example.xml --> Ehcache persistence configurations with JGroups enabled  
---**webapp**  
----**static**  
-----**default**  
------**css**  
-------backbaseportalserver.css  
------**media**  
-------BB_logo_.png  
-------bb_ribbon.png  
-------bg_pm.png  
-----**ext-lib**  
------jquery-1.8.3-min.js   
-----**RSS**  
------**xsl**  
-------rss2html.xsl  
------rss-example-feed.xml  
-----**samples**  --> Sample bundle  
------**chromes**  
-------**blank**  
--------chrome-blank.html  
------**conf**  
------**containers**  
------**html**  
-------**chromes**  
--------chrome-blank.html  
-------portalAction.html  
------**js**  
-------**vendor**  
--------jquery-1.10.2.min.js  
-------main.js  
-------plugins.js  
------**lib**  
------**media**  
-------apple-touch-icon-precomposed.png  
-------favicon.ico  
-------portal-image.png  
------**support**  
------**widgets**  
-------**sample**  
--------**css**  
---------sample.css  
--------**import**  
---------myComp-sc-wdg-sample.xml  
--------**js**  
---------sample.js  
--------icon.png  
--------index.html  
--------README.md  
----version.txt --> Build version info file  
----**WEB-INF**  
-----**default** --> default Backbase templates  
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
--------InstallationValidationTestST.java --> Test used to validate Mashup Services on embedded server  
-------**portalserver**  
--------InstallationValidationTestST.java --> Test used to validate Portal Foundation on embedded server  
---**resources**  
-**tools** --> Folder with various Backbase tools  
--**grunt** --> Various Grunt scripts  
--**nodejs** --> Various NodeJS scripts  
--importer-5.5.0.0-jar-with-dependencies.jar --> Backbase Importer tool  
-build.bat  
-build.sh  
-initial_build.bat  
-initial_build.sh  
-pom.xml  
-start.bat  
-start.sh  
