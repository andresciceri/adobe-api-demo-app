const PDFServicesSdk = require('@adobe/pdfservices-node-sdk'),
  fs = require('fs');

try {
  const credentials =
    PDFServicesSdk.Credentials.serviceAccountCredentialsBuilder()
      .fromFile('pdfservices-api-credentials.json')
      .build();

  const jsonString = fs.readFileSync('data/budget-order-data.json'),
    jsonDataForMerge = JSON.parse(jsonString);

  const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
  const documentMerge = PDFServicesSdk.DocumentMerge,
    documentMergeOptions = documentMerge.options,
    options = new documentMergeOptions.DocumentMergeOptions(
      jsonDataForMerge,
      documentMergeOptions.OutputFormat.PDF
    );
  const documentMergeOperation = documentMerge.Operation.createNew(options);
  const input = PDFServicesSdk.FileRef.createFromLocalFile(
    'templates/Template-TK-Budget.docx'
  );
  documentMergeOperation.setInput(input);
  documentMergeOperation
    .execute(executionContext)
    .then((result) => result.saveAsFile('outputs/tk-budget-order.pdf'))
    .catch((err) => {
      if (
        err instanceof PDFServicesSdk.Error.ServiceApiError ||
        err instanceof PDFServicesSdk.Error.ServiceUsageError
      ) {
        console.log('Exception encountered while executing operation', err);
      } else {
        console.log('Exception encountered while executing operation', err);
      }
    });
} catch (err) {
  console.log('An Error Happened', err);
}
