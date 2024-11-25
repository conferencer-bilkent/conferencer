# UsersApi

All URIs are relative to *http://localhost:8080/api*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAllUserNames**](UsersApi.md#getAllUserNames) | **GET** /users/names | Get all user names |


<a id="getAllUserNames"></a>
# **getAllUserNames**
> List&lt;String&gt; getAllUserNames()

Get all user names

### Example
```java
// Import classes:
import org.openapitools.client.ApiClient;
import org.openapitools.client.ApiException;
import org.openapitools.client.Configuration;
import org.openapitools.client.models.*;
import org.openapitools.client.api.UsersApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8080/api");

    UsersApi apiInstance = new UsersApi(defaultClient);
    try {
      List<String> result = apiInstance.getAllUserNames();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling UsersApi#getAllUserNames");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**List&lt;String&gt;**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of all user names |  -  |

