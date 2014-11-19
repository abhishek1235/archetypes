# Archetype backbase-forms-archetype

Version **5.5.0.4**

##Overview
A blank Maven archetype for the standard project setup of Backbase Forms.

This archetype facilitates standard project setup as Backbase Expert Services do it. The archetype is currently pre-configured for Jetty and Tomcat 7. One can easily switch from Tomcat 7 to Tomcat 6 by changing a single line within the POM file. 

##Usage
Follow the steps below to get started with this archetype. TODO

1. Generate the project. Open a command shell and go to a location where you want to create the content services project. Execute the following command:
    <pre>
    $ mvn archetype:generate
        -DarchetypeArtifactId=backbase-forms-archetype
        -DarchetypeGroupId=com.backbase.expert.tools
        -DarchetypeVersion=5.5.0.4
    </pre>
Refer to TODO for more information.  
2. Optionally adjust JMV properties, differently configure the logback, or make some changes to TODO. For any of these steps refer to TODO.  
3. Use the following command from the root project folder to prepare the project for running:
    <pre>
    $ mvn clean install
    </pre>
If you want to run Forms Runtime on Jetty run the following Maven command within forms-runtime folder:  
    <pre>
    $ mvn jetty:run
    </pre>
Or, if you want to run Forms Runtime on Tomcat 7 run the following Maven command within forms-runtime folder: 
    <pre>
    $ mvn tomcat7:run
    </pre>

Note that by default both Jetty and Tomcat for Forms Runtime use the port TODO. In case you need to choose a different ports since you maybe already have another process running on some of these ports, make necessary changes in Jetty and Tomcat plugins within Forms Runtime POM file..  
4. Test Forms Runtime by opening the TODO in a browser: TODO (pay attention to the port number).  
5. Test Forms UI by opening the TODO in a browser:TODO (pay attention to the port number).  

##Anatomy
TODO