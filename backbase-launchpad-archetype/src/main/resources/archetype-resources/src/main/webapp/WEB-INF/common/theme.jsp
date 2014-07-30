<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="lp" uri="http://launchpad.backbase.com/taglib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%--
    Select theme:
    Theme path is a jndi environment entry.
    Theme name is a page property which defaults to 'default' if empty
--%>
<c:set var="themeName" value="${lp:hasProperty(item, 'themeName') ? lp:property(item, 'themeName') : 'default'}" />
<link rel="stylesheet" href="${lpconf_themePath}/${themeName}/base.css" type="text/css"/>

<%--
Client side Less example
<link href="${lpconf_themePath}/${themeName}/base.less" rel="stylesheet/less" type="text/css" />
<script src="${contextPath}/static/launchpad/support/less/less-1.6.1.min.js"></script>
--%>

