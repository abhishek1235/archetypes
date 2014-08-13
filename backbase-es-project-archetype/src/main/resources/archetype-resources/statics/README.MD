Statics

Summary
This section contains the static only artefacts that will be use to build the portal FE (inc pages, containers, widgets, themes, css and js etc)

The bundles are now broken into the most simple of usecase for visioning of themes and a sample bundle. You may
want to add additional themes and bundles to meet your requirements. As a good rule to apply if you should decided 
to make a new bundle consider the follow:

- Never have bundles that are dependant of other standard bundles
- Only have one core bundle that contains generic utilities, with no other dependencies. Don't include component 
	in this bundle that connect to a datasource.
- A standard bundle should only have one purpose, So that if it is used by other portals everything in the bundle is deemed useful. e.g. 
	-- don't include ice widgets and custom page layout containers into one bundle, as a portal may want the one but not the other.
	-- don't include two widgets that use different BE systems. So that a transactions widget and a login widget should live in different bundles.
