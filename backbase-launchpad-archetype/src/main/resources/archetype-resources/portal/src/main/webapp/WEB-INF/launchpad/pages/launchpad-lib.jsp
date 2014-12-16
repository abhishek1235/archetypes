<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../common/directives.jspf" %>

<c:set var="lpVersion" value="${lpconf_build['launchpad.version']}"/>

<script src="${contextPath}/static/launchpad/support/requirejs/require.js"></script>
<script src="${contextPath}/static/launchpad/lib/common/rest-client.js"></script>
<script src="${contextPath}/static/launchpad/lib/common/util.js"></script>
<script src="${contextPath}/static/launchpad/support/modernizr.js"></script>
<script src="${contextPath}/static/launchpad/conf/require-conf.js"></script>

<%-- Common JS --%>
<%--<c:choose>
    <c:when test="${lpconf_useFrontendBuild}">--%>
        <%--<script src="${contextPath}/static/launchpad/support/launchpad-support.js?v=${lpVersion}"></script>--%>
        <script src="${contextPath}/static/launchpad/pages/launchpad-page/launchpad-page.js?v=${lpVersion}"></script>
    <%--</c:when>
    <c:otherwise>
        <script src="${contextPath}/static/launchpad/pages/launchpad-page/portal-setup.js"></script>
        <script src="${contextPath}/static/launchpad/pages/launchpad-page/require-widget.js"></script>
    </c:otherwise>
</c:choose>--%>
<!--[if gt IE 8]><!-->
<script src="${contextPath}/static/launchpad/support/hammer.js"></script>
<!--<![endif]-->
