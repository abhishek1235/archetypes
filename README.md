#Archetypes

##Overview

A collection of Maven archetypes for Backbase Portal created by Expert Services that can help help with initial project setup.

This assumes you're already familiar with Backbase Development setup available at https://my.backbase.com/doc-center/manuals/portal/inst_devl.html and need more advanced archetypes. These advanced archetypes are tailored on needs we have experienced when working with various clients around the world so they represent also best practice on how to bootstrap your project.

##List of currently available archetypes:
1. backbase-portal-archetype-all-in-one from version 5.3.1.1

More are to come shortly.

##Usage

In order to use them, you need to pull code from this git repo, build it locally and then release it to  Maven repository in your organization. This will enable all people with access to Maven repository in your organization to use these archetypes. Of course, you can also use them from your lcoal Maven repository without need to release them.

Feel encouraged to creat eyour own versions by forking the code and further chnaging them to your needs.

After you have enabled these archetypes locally or in your organization, you are ready to start using them. Usage is the same as already explained on page https://my.backbase.com/doc-center/manuals/portal/inst_devl.html 

I next few lines we are giving modification to reference page from this manual since these archetypes ar emore ad 

###7 Development Setup

Following steps are replacing/complementing 12 steps described in Development Setup Procedure.

1. As-is.
2. All is the same except that we ned to use this archetype, so Maven command would look like this:
```sh
mvn archetype:generate -DarchetypeArtifactId=<archetype-name> -DarchetypeGroupId=com.backbase.expert.tools.archetypes -DarchetypeVersion=<archetype-version>
```
3. As-is.
4. As-is.
5. Logback is already pre-configured and configuration file for it is located in configuration folder.
6. Properties configuration file is already pre-configured and it is located in configuration folder.
7. Environment entries are already defined within Jetty and Tomcat configuration files that are located inside configuration/jetty and configuration/tomcat folders.
8. Done inside properties configuration file a spart of step #6.
9. Pre-configured for 1.6.
10. Pre-configured.
11. As-is.
12. As-is.

####7.1 Maven Settings File
As-is.

####7.2 Database setup (optional)
Jetty and Tomcat files with datasource configurations are located inside configuration/jetty and configuration/tomcat folders. Everything else is as-is.

####7.3 Portal Example
As-is.

####7.4 Test

Following steps are replacing/complementing 4 steps described in this section.

1. Use the folloing commands instead
```sh
mvn clean install -P create-database
```
```sh
mvn jetty:run-war if you want to use Jetty 
```
OR 
```sh
mvn tomcat7:run-war if you want to use Tomcat 7
```

Optionally run following command to delete and re-create databases when required 
```sh
mvn clean -P clean-database
```

Both Jetty and Tomcat use 8080 ports.

2. As-is.
3. As-is.
4. As-is.
