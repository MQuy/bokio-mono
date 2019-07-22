### Usage

```
$ yarn
$ cd node_modules/ts-loader && yarn && yarn build
$ cd packages/areas/invoices && yarn start
```
### Structure

```
/companyId/invoices-beta     -> Bokio/Bokio/Bokio/n/packages/areas/invoices/build/index.html
/companyId/articles-beta     -> Bokio/Bokio/Bokio/n/packages/areas/invoices/build/index.html
/companyId/closures          -> Bokio/Bokio/Bokio/n/packages/areas/accounting/build/index.html
/companyId/salary            -> Bokio/Bokio/Bokio/n/packages/areas/salary/build/index.html
/companyId/supplier-invoices -> Bokio/Bokio/Bokio/n/packages/areas/suppliers/build/index.html
/companyid/reports/ledger    -> Bokio/Bokio/Bokio/n/packages/areas/reports/build/index.html
```


#### Backend

Each rule for each areas

```c#
# Web.config
<rule name="React invoices routes" stopProcessing="true" patternSyntax="ECMAScript">
  <match url="^([0-9A-F]{8}-([0-9A-F]{4}-){3}[0-9A-F]{12}/)?(invoices-beta|rot-rut-errands|articles-beta|customers-beta)(/|$)" ignoreCase="true" />
  <conditions logicalGrouping="MatchAll">
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
    <add input="{REQUEST_URI}" pattern="(api)" negate="true" ignoreCase="true" />
    <add input="{REQUEST_URI}" pattern="(bundles)" negate="true" ignoreCase="true" />
    <add input="{REQUEST_URI}" pattern="(StatementOfEarnings)" negate="true" ignoreCase="true" />
  </conditions>
  <action type="Rewrite" url="{R:1}/Invoices/R" />
</rule>
```

```c#
# Invoices/Controllers/RController.cs

namespace Bokio.Areas.Invoices.Controllers
{
    public class RController : BokioControllerBase
    {
        private AreaIndexHtmlHelper AreaIndexHtmlHelper { get; set; }

        public InvoicesRController()
        {
            AreaIndexHtmlHelper = new AreaIndexHtmlHelper() { AreaPath = AppDomain.CurrentDomain.BaseDirectory + "/n/areas/invoices/build/" };
        }

        public ActionResult Index(Guid? org, IPrincipal user)
        {
            var htmlContext = AreaIndexHtmlHelper.IndexContent(org, user);
            return Content(htmlContext, "text/html");
        }

    }
}
```

#### Frontend

Each area has their own output assets, so team who in charge of that area can decide which approaches they think is more suitable. In the example below, accounting area uses react 16.8 while invoice area want to try out the newest react version aka 17.0 -> increasing flexibility and can deploy an area without affecting other areas

```
n
├── config
│   ├── tsconfig.base.json
│   └── webpack.config.base.js
├── packages
|   ├── areas
|   │   ├── invoices
|   │   │   ├── build
|   │   │   │   ├── static
|   │   │   │   │   ├── js
|   │   │   │   │   ├── css
|   │   │   │   │   └── media
|   │   │   │   └── index.html
|   │   │   ├── src
|   │   │   │   ├── components
|   │   │   │   ├── scenes
|   │   │   │   │   ├── Articles
|   │   │   │   │   └── Customers
|   │   │   ├── index.ts
|   │   │   ├── tsconfig.json
|   │   │   ├── webpack.config.js
|   │   │   └── package.json
|   │   ├── accounting
|   │   │   ├── build
|   │   │   ├── src
|   │   │   │   ├── components
|   │   │   │   ├── scenes
|   │   │   │   │   ├── Closures
|   │   │   │   │   └── Bookkeeping
|   │   │   ├── index.ts
|   │   │   ├── tsconfig.json
|   │   │   ├── webpack.config.js
|   │   │   └── package.json
|   ├── core
|   │   ├── elements
|   │   ├── api
|   │   ├── components
|   │   │   ├── Dropdown
|   │   │   │   ├── Dropdown.tsx
|   │   │   │   └── dropdown.less
|   │   │   ├── index.ts
|   │   │   └── package.json
|   │   ├── hooks
|   │   ├── contexts
|   │   └── utils
|   ├── tools
|   │   └── bokio-scripts
|   package.json
```

There are two kinds of navigations
- In the same area via `pushState`
- Not in the same via `location.href` aka reloading

```tsx
# InvoiceShow.tsx
import as React from "react"; // version 17.0
import { Button } from "@bokio/elements/Button";
import { getRoute } from "@bokio/utils/route";
import { CompanyList } from "@bokio/components/CompanyList/CompanyList"; // bokio shared component
import VerificationModal from "components/VerificationModal/VerificationModal"; // invoice team's local component

const InvoiceShow = () => {
  const customersPath = getRoute("customers", { company: "xxx" });
  const ledgerPath = getRoute("ledgerReport", { company: "xxx", fromDate, toDate });
  // each team can use their own convention
  const invoiceRequest = useApi(xxx);

  return (
    <Page>
      <Link area="invoices" route={customersPath}>Go to customers</Link>
      <Link area="invoices" route={ledgerPath}>Ledger</Link>
    </Page>
  );
};
```

```tsx
# ClosureShow.tsx
import as React from "react"; // version 16.8 <- we can use different react versions for each areas
import * as fnsParse from "date-fns/parse"; // this lib only exists in accounting's area

const ClosureShow = () => {
  const customersPath = getRoute("customers", { company: "xxx" });

  return (
    <UseApi request={xxx}>
      <RenderRequest />
      <Link area="accounting" route={customersPath}>Go to customers</Link>
    </UseApi>
  );
};
```

### Workflow

#### Coding
Invoices team will open vscode at `n/packages/areas/invoices` and run `yarn start`, it will be faster due to
- webpack only compiles and watchs parts of our codebase
- vscode (linter) runs in subfolder

#### Convention
- When adding a new component, it is preferred to be in your area
- The importing rule is bottom layers cannot import top layers and same layers cannot import each other
  - `areas/invoices`, `areas/accounting`
  - `core/components`, `core/hooks`, `core/contexts`
  - `core/elements`
  - `core/utils`
  - `core/api`, `core/lang`
- `n/config` contains base config for our tools like webpack, jest, puppeteer ... each area can decide to reuse these tools (by default from code generator) or roll their own solution

### 🤔
- What should we do if there is a change in `packages` (of course your current working area which is run via webpack gets rebuilt), we should rebuild whole areas (or related areas) to check errors but when? I don't think to do it right after changing a file in `packages` is a good idea. Is it better if we do it in CI?
- It will be a lot boilerplate code when creating a new area -> write code generator
- Should each area has their our own `api` (proxy.ts, model.ts)
- How can we define "area"? IMO, area is the group of pages which belongs to the same top menu item for example `Accounting`, `Reports`, `Invoice`, `Suppliers`, `Salaries` ... because people usually navigate between those pages so it is better if they can navigate without reloading
- When compiling via webpack, how to group our assets to share between areas (`n/build` for `packages` and vendor)