The files in `threshold` are generated by following the instructions at https://github.com/WICG/webpackage/tree/main/go/signedexchange#creating-our-first-signed-exchange

To install the tools, checkout the webpackage repository and run in `$repository/go/signedexchange`:
```
GOBIN=$(pwd)/bin go install ./cmd/...
```

```
openssl ecparam -out threshold/threshold.key -name prime256v1 -genkey
openssl req -new -sha256 -key threshold/threshold.key -out threshold/certificate_signing_request.csr -subj '/CN=threshold.ic.ownerless.domain/O=IC/C=US'
openssl x509 -req -days 90 -in threshold/certificate_signing_request.csr -signkey threshold/threshold.key -out threshold/certificate.pem -extfile <(echo -e "1.3.6.1.4.1.11129.2.1.22 = ASN1:NULL\nsubjectAltName=DNS:threshold.ic.ownerless.domain")
gen-certurl -pem threshold/certificate.pem -ocsp <(echo ocsp) > threshold/certificate.cbor
```

The signed exchanges in `websites/sxg` are generated as follows:

```
gen-signedexchange -uri https://threshold.ic.ownerless.domain/index.html \
  -content websites/sxg/index.html \
  -certificate threshold/certificate.pem \
  -privateKey threshold/threshold.key \
  -certUrl https://localhost:3000/sxg/certificate.cbor \
  -validityUrl https://threshold.ic.ownerless.domain/validity \
  -o websites/sxg/index.sxg 

gen-signedexchange -uri https://threshold.ic.ownerless.domain/service_worker.sxg \
  -content websites/sxg/service_worker.js \
  -certificate threshold/certificate.pem \
  -privateKey threshold/threshold.key \
  -certUrl https://localhost:3000/sxg/certificate.cbor \
  -validityUrl https://threshold.ic.ownerless.domain/validity \
  -o websites/sxg/service_worker.sxg
```

The Chrome flag is generated as follows:
```
openssl x509 -noout -pubkey -in threshold/certificate.pem | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64
LqdceP9PgoekstR15tKsxeCq5jZsx+NlSpHzPSxs6UM=
```

Run Chrome:
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/Users/ulan/tmp  --ignore-certificate-errors --ignore-certificate-errors-spki-list="LqdceP9PgoekstR15tKsxeCq5jZsx+NlSpHzPSxs6UM="  https://localhost:3000/sxg/index.sxg
```
