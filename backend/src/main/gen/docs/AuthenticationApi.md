# AuthenticationApi

All URIs are relative to *http://localhost:8080/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**userLogin**](AuthenticationApi.md#userLogin) | **POST** /auth/login | User login |
| [**userSignup**](AuthenticationApi.md#userSignup) | **POST** /auth/signup | User signup |


<a id="userLogin"></a>
# **userLogin**
> LoginResponse userLogin(loginRequest)

User login

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AuthenticationApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8080/api");

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    LoginRequest loginRequest = new LoginRequest(); // LoginRequest | Login credentials
    try {
      LoginResponse result = apiInstance.userLogin(loginRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#userLogin");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | [**LoginRequest**](LoginRequest.md)| Login credentials | |

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Login successful |  -  |
| **401** | Unauthorized - Invalid credentials |  -  |

<a id="userSignup"></a>
# **userSignup**
> userSignup(user)

User signup

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.AuthenticationApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8080/api");

    AuthenticationApi apiInstance = new AuthenticationApi(defaultClient);
    User user = new User(); // User | User details for signup
    try {
      apiInstance.userSignup(user);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuthenticationApi#userSignup");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **user** | [**User**](User.md)| User details for signup | |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | User created successfully |  -  |
| **400** | Invalid request data |  -  |

