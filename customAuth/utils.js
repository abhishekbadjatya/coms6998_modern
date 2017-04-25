let extractMethodAndPath = (arn) => {
  // The value of 'arn' follows the format shown below.
  //
  //   arn:aws:execute-api:<regionId>:<accountId>:<apiId>/<stage>/<method>/<resourcePath>"
  //
  // See 'Enable Amazon API Gateway Custom Authorization' for details.
  //
  //   http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
  //

  // Check if the value of 'arn' is available just in case.
  if (!arn)
  {
    // HTTP method and a resource path are not available.
    return [ null, null ];
  }

  var arn_elements      = arn.split(':', 6);
  var resource_elements = arn_elements[5].split('/');
  var http_method       = resource_elements[2];
  var resource_path     = resource_elements[3];
  var resource_instance = resource_elements[4];
  
  return {http_method, resource_path, resource_instance};
}

module.exports = {
  extractMethodAndPath
};