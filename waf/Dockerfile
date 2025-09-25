FROM owasp/modsecurity-crs:nginx
COPY ./tools/default.conf.template /etc/nginx/templates/default.conf.template
COPY ./tools/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf /etc/modsecurity.d/owasp-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf
COPY ./tools/REQUEST-999-LOCAL-POLICY-AFTER-CRS.conf /etc/modsecurity.d/owasp-crs/rules/REQUEST-999-LOCAL-POLICY-AFTER-CRS.conf