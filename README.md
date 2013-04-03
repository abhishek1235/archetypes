#Archetypes

Version **5.4.0.6**

##Overview
A collection of Maven archetypes related to Backbase Portal created by Backbase Expert Services that can help with initial project setup and other tasks.

Archetypes are deployed to Backbase Expert Service's Maven repository at

1. PUBLIC RELEASES   	**https://repo.backbase.com/extensions** 
2. INTERNAL SNAPSHOTS  	**https://repo.backbase.com/extensions-snapshots**

##List of currently available archetypes:
1. **backbase-portal-archetype-all-in-one**, from version **5.3.1.1**
2. **backbase-contentservices-archetype-all-in-one**, from version **5.4.0.5**
3. **backbase-mashupervices-archetype-all-in-one**, from version **5.4.0.6**

##Usage

###Pre-conditions
We assume you're already familiar with [Backbase Development Guide](https://my.backbase.com/doc-center/manuals/portal/inst_devl.html) and that you need more advanced archetypes. These advanced archetypes are tailored by needs we have experienced when working with various clients around the world so they represent also a best practice on how to quickly bootstrap your project and solve some specific tasks related to Backbase suite of products.

###Maven repository configuration
Configure your Maven configuration to include the Backbase extensions releases repository (https://repo.backbase.com/extensions).

###Maven archetype project generation
	<pre>
	$ mvn archetype:generate -DarchetypeArtifactId=<archetype_name> -DarchetypeGroupId=com.backbase.expert.tools -DarchetypeVersion=<archetype_version> 
	</pre>

##Customization
Feel encouraged to create your own versions of these archetypes by forking the code and further changing it to meet your specific needs if you have them. If you feel change you have on mind is more of a generic change and other Backbase customers could use it, please feel free to share ideas on Github Issues section.

After you have build these archetypes locally and optionally deploy accross your organization, you are ready to start using them. Each archetype is specific so details on usage are within each of them.

In order to use these archetypes, you need to pull or fork code from this Git repository and build it locally:  
	<pre>
	$ mvn clean install
	</pre>
This way you can use these archetypes from your local Maven repository directly. 

###Deploy within organization
Optionally, you can also install them into a Maven repository within your organization. This would enable other people from your organization with access to that Maven repository to use these archetypes. You should do this with Maven deploy plugin. We already use it to deploy to our internal Maven repository so you just need to chnage our settings into yours. More info on this plugin you can find [here](http://maven.apache.org/plugins/maven-deploy-plugin). Key configuration you need to change is related to distributionManagement section inside main POM file.

This way, all your coleagues can use these archetypes from your organization's Maven repository. 

## History of Changes
5.4.0.6 

1. Initial version of Mashup Services Archetype 
2. Alignement of All-In-One and Content Services Archetypes with 5.4.0.6 version of Backbase Portal suite
3. Adding importer.jar to All-In-One Archetype 
4. Documentation optimization

5.4.0.5 

1. Initial version of Content Services Archetype 
2. Alignement of All-In-One Archetype with 5.4.0.5 version of Backbase Portal suite
3. Documentation re-structuring

5.3.1.1 

1. Initial version of All-In-One Archetype