package com.backbase.test.theme;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class InstallationValidationIT {

    /**
     * Test if the portal is running and if the admin user is available.
     *
     * @throws IOException when caused by executeMethod
     */
    @Test
    public void basicValidation() throws IOException {
        // request url assuming default set up
        String url = "http://localhost:${portal.port}/portalserver/static/themes/default/css/base.css";

        // set up the getMethod
        GetMethod get = new GetMethod(url);
        get.setFollowRedirects(false);

        // Execute the request
        HttpClient client = new HttpClient();
        int resCode = client.executeMethod(get);

        // check if the http status code is 200 (OK)
        assertEquals("GET (" + url + ")", 200, resCode);
    }
}