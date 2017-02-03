---
category:   vaccines
title:      Team and methodology
img:        articles/home-vaccines-team.jpg

gallery:
  - image: pages/IMG_5230-1040x635.jpg
    title: Raúl, Miguel (escondido), David y Eva, puliendo la visualización. | Javier de Vega
  - image: pages/Medicine-report-61-1040x602.jpg
    title: Antonio, en una de las entrevistas que realizó en Acra. | Joseph Akwasi
  - image: pages/IMG_2391-1040x624.jpg
    title: Eva, en plena entrevista en Rio de Janeiro. | Anne Vigna
  - image: pages/Antonio11-1040x694.jpg
    title: Antonio, atento, en el laboratoria CePAT. | Henry Nelson Souza
  - image: pages/IMG_5223-1040x694.jpg
    title: Cabezas echando humo. | Javier de Vega
  - image: pages/IMG_20150619_191737-1040x780.jpg
    title: Miguel, desquiciado con la base de datos.
  - image: pages/Redecilla.jpg
    title: Eva, en el laboratorio público Farmanginhos, vestida para la ocasión.| Anne Vigna

order:      5
slug:       team
ref:        vaccines-team
lang:       en
---

<div class="container page-content" markdown="1">
<div class="page-content-container" markdown="1">

## The team

Medicamentalia is a project of [Civio](http://www.civio.es/en/) in which, in addition to members of the foundation, we have had valuable valuable partnerships. To all of you, the team:

*   **Eva Belmonte**. Journalist. Original concept, project lead, research, data gathering and analysis, and fieldwork in Brazil.
*   **Miguel Ángel Gavilanes**. Journalist. Research, data gathering and analysis. Video editing and coordination.
*   **Raúl Díaz Poblete**. Developer. Web development, user interface design and data visualization.
*   **Antonio Villarreal**. Journalist. Research, fieldwork in Ghana and editing.
*   **David Cabo**. Developer. Data scraping, clearing and analysis.
*   **Javier de Vega**. Journalist. Research, editing and communication.
*   **Antonio Guzmán**. Designer. Web design and illustration.
*   **Cristina Moreno**. Project management.

### Contributors

*   **Anne Vigna**. Video and photography in Rio de Janeiro.
*   **Elio Stamm**. Vídeo in Ghana.
*   **Joseph Akwasi**. Photography in Ghana.
*   **Henry Souza Nelson**. Photography in Ghana.
*   **Marta Silvera**. English translations.
*   **Jen Bramley**. English version editing.
*   **Fabiola Czubaj (La Nación)** helped us understand Argentina's data.
*   **Belinda Grasnik (Correctiv!)** gathered the data for Germany.
*   **Kristof Clerix (Knack)** gathered the data for Belgium.

### Acknowledgements

We begin by thanking the support from our _media partners_ in this project ([20 Minutos](http://www.20minutos.es/), [Cadena Ser](http://cadenaser.com/), [Corriere della Sera](http://www.corriere.it/), [Correctiv!](https://correctiv.org/) and [La Nación](http://www.lanacion.com.ar/)), because they gave us the green light before even seeing a single database row nor a sentence in an article, showing a blind trust that we hope to have rewarded. And to Journalism Grants [Journalism Grants](http://journalismgrants.org/), which awarded us the grant that allowed us to create Medicamentalia.

The task of understanding something as complex as the international regulations and rules affecting the prices of medicines is colossal. So we want to thank those who helped us through some early conversations, either face to face or by telephone, email or videoconference, to know what and how to investigate. Thanks to Elisa Lopez Varela, doctor at the Medical Research Center in Infectious Diseases in Mozambique; Elisa Sicuri, health economist at IS Global in London; Carlos Miranda, from Farmamundi in Madrid; Judit Rius, US director of the Campaign for Access to Essential Medicines of Médicins Sans Frontières in New York; Fran Franco, International Affairs at Farmaindustria in Madrid; Margaret Ewen, responsible for the HAI database in the Netherlands; and Bernard Appiah and Barbara Gastel, professors from the Texas A&M University, for helping us improve the accuracy and depth of our journalism. Thanks also for their time to Javier Pardo, from Médicins du Monde; and Paola Ariza, Colombian journalist who lent us a hand with data of her country.

We would also like to thank in a special way the patience of all the interviewees in Brazil and Ghana, who agreed to be filmed, be asked questions and share their knowledge.

And we end up thanking Fernando Toledo and Jen Bramley, because they helped us complete and polish Medicamentalia when the final deadline was approaching. 

{% include gallery.html id="team" %}

## Methodology

### Early research

Before starting the work we needed to study. We conducted interviews and reviewed dozens of _papers_ and reports on the measurement of prices. We didn't think even remotely that we were the first to face this issue and wanted to learn from those before us. In this sense, the experience of initiatives such as [Medicamentos Abiertos](http://www.revistazo.biz/medicamentosabiertos/), in Central America, or the [fantastic project](http://mpr.code4sa.org/) of Code for South Africa was very useful.

For weeks, we looked for a common standard through which we could compare, in the most rigorous way possible, the accessibility to treatments in different countries. That's when we discovered the cornerstone of the project, the [database](http://www.haiweb.org/MedPriceDatabase/) developed by the not-for-profit Health Action International ([HAI](http://www.haiweb.org/)). Thanks to an [exhaustive and detailed methodology](http://www.haiweb.org/medicineprices/manual/documents.html), which we studied thoroughly to understand the complexity of the data, they've managed to collect information from dozens of countries worldwide on pricing, access, differences between brand name drugs and generics, cost composition ... of 14 essential medicines in specific compositions: diazepam, paracetamol, cotrimoxazole, atenolol, glibenclamide, diclofenac, ceftriaxone, captopril, amoxicillin, amitriptyline, ciprofloxacin, omeprazole, salbutamol and simvastatin.

### Database

The first obstacle to our research, aimed at comparing countries of different regions and income, was that studies of HAI were dated in different years. Although we considered updating all the figures to 2015 (taking into account inflation and currency rates' changes), we eventually decided that the comparisons would be inaccurate if we used absolute data. That's the reason you won't find prices in our [data visualization](/en/precios/#viz).
{% include caption.html img="pages/Metodologia-460x355.jpg" caption="Analysing HAI's data" author="Javier De Vega" align="alignright" %}
Thus, **we decided to use two relative indicators** part of HAI's reports: **MPR** (Median Price reference), the ratio of the drug price versus an [international reference value](http://www.msh.org/) set by the not-for-profit organisation MSH. We can compare the deviation across countries from this reference price, which is updated every year. The second indicator we analyse is **_affordability_**, i.e. the work time needed to pay for a full treatment in each country, using the net salary of the lowest-paid public servant (as specified by HAI's methodology in order to avoid more volatile figures in developing countries). In both cases, **we decided to do the analysis using the price of the cheapest generic and display both private (direct purchases in pharmacy counters or with prescription from private insurers) and public data (purchases subsidised partially or fully by public health systems)**.

With our goals now clear, on March 11 we downloaded about 70 documents from HAI's website, and processed them automatically to build a working database. We then [filled the gaps, cleaned, restructured](https://github.com/civio/medicamentalia-theme/wiki/Extra-notes-about-the-methodology) and checked all the data, either automatically or manually. That way, we had set our base camp: we had data from 56 countries for 14 essential drugs. Having understood the methodology and cleared up some doubts thanks to Margaret Ewen (HAI), now came the second part: add data for developed countries to carry out the global comparison. We did it through official sources and after a study of the public health systems of each of the five included countries: Italy, Argentina, Spain, Belgium and Germany. In all these cases, we used data from 2015 and the latest available international reference price, 2013, just as is done in HAI's studies. In the German case, the team at Correctiv! collected the data and we fact-checked it to ensure everything was accurate, as was the case.

### Spain

The process of gathering the **price** data has varied depending on the contribution of the public administration in each country. In **Spain**, the Social Security, the national government-sponsored social insurance programme, provides health coverage to citizens. Regarding the **salary**, the lowest one is that of a class E official, with a level 1 complement, to which the "lowest specific supplement" for 2015 is added. The [source](http://www.sepg.pap.minhap.gob.es/sitios/sepg/es-ES/CostesPersonal/EstadisticasInformes/Documents/Retribuciones%20del%20personal%20Funcionario%202015.pdf) is the Secretary of State for Budget and Expenditures, part of the Ministry of Finance and Public Administration.

As for prices, the Ministry of Health publishes on its _Nomenclator de Facturación_ the list of drugs subsidized by the national health system. We took the database for June 2015 from the [official website](http://www.msssi.gob.es/profesionales/nomenclator.do) and —for each of the 14 drugs- we searched for the cheapest generic with the closest dosage to those established by HAI methodology, according to their retail price including VAT. This is the **private price**: the cost of the drug over the counter, without public subsidies, with no prescription or with one from private insurers. 

The _Nomenclator_ includes also the beneficiary's contribution. These 14 medicines are subject to two categories of patient contribution: normal or special. The normal contribution varies depending on the patient's income level. We have chosen the lowest income level possible, which, according to the [current law](http://www.boe.es/diario_boe/txt.php?id=BOE-A-2012-5403) means that the patient pays 40% of the reference price. In the special contribution category, the percentage is 10%.

### Italy

The healthcare system in **Italy** is similar to that of Spain, with its National Health Service (SSN). The national government establishes three types of drugs, with different subsidies: Class A, for essential medicines and for chronic patients, which are paid for by the SSN; Class C, other medicines, which are charged to the patient; and class H, for hospital use.

Twelve of the drugs, all but diazepam and paracetamol, are included in Class A, so are covered by the public health system. However, the SSN subsidizes only the reference price fixed in 2011, and the difference —if any— is covered by the patient. The Italian Drug Agency (AIFA) publishes a [list](http://www.agenziafarmaco.gov.it/it/content/dati-sulle-liste-dei-farmaci-open-data) with the **private prices**, the corresponding subsidies and the resulting gap. The latter will be our **public price**. We have not included the Class C drugs in the database, as there is no official document setting their prices.

However, in Italy there is a fee per prescription, the _ticket_, set by each regional government, and which gets added to the difference mentioned in the previous paragraph. From 1€ in Trentino to 3.5€ in Campania, the prices of medicines vary according to the place of residence. Because of this regional disparity of public prices we decided to combine the results and use the median for the entire country.

Finally, the lowest **salary** for an Italian public servant is the one corresponding to group A. We took the average for 2013 published by the government ([here](https://www.aranagenzia.it/index.php/statistiche-e-pubblicazioni/dati-statistici)), as they remained unchanged in 2014 or 2015.

### Argentina

The healthcare system in **Argentina** differs from public health systems in Europe. The affiliation of workers to a health service is required by law. However, the national government is not responsible for organising, funding and providing the medical care. These functions are delegated to the Social Works, which are the main health insurance providers. On the other hand, there is _Medicina Prepaga_ (Prepaid Health), health care provided by private insurers.

However, the [Compulsory Medical Programme](http://www.sssalud.gov.ar/index/index.php?cat=beneficiarios&opc=pmoprincipal) (PMO) — establishes the basic basket of services that must be provided by the Social Works. It also provides coverage for the 14 medications.

Most often, the minimum subsidy by the insurer is 40% of the reference price of the drug. But the government mandates [a reduction of 70% on the reference price](http://www.sssalud.gov.ar/index/index.php?opc=genericos70) for some generics. We have consulted this list first to determine the **private price** and the **public price** for those generics qualifying for such subsidies. The latest update of the database, on May 29 2015, contains four active ingredients: atenolol, simvastatin, salbutamol and glibenclamide.

For prices of other drugs we have followed two paths in parallel. First, we looked up the prices of the remaining 10 drugs (with the dose and packaging specified in the methodology) in [Kairos](http://www.ar.kairosweb.com), a scientific journal for pharmacies. We also downloaded manually (last update June 19 2015) data about the drugs from the [Vademécum Nacional de Medicamentos](http://anmatvademecum.servicios.pami.org.ar/index.html) (VNM) of the National Administration of Drugs, Food and Medical Technology (ANMAT), a regulatory agency under the Ministry of Health of Argentina. The VNM is an official source which includes all the drugs marketed in Argentina and is updated continuously. We then compared the lowest price for each of the compounds, keeping the ANMAT data whenever possible, as it is official source. The resulting figure is the **private price**, and after applying a reduction of 40% the **public price** (as it is the cheapest generic in the market).

Finally, the lowest **salary** for an Argentinian public servant in 2015 — applicable since August 2014 — is 5,777.95 Argentinian pesos (equivalent to 562.66€ using June 19 2015 exchange rates), according to the [_Oficina Nacional de Empleo Público_](http://www.sgp.gov.ar/contenidos/onep/salarios/docs/SINEP_agosto_2014.pdf) (ONEP) — National Public Employment Office — of Argentina.

### Belgium

The Belgium data, gathered by Kristof Klerik, come from two public bodies: NIHDI (National Institute for Health and Disability Insurance) and BCFI (Belgian Centre for Pharmacotherapeutical Information). The calculation of the Belgian co-payment applies to the ordinary Belgians insured, eighty percent of the population. The so-called "preferential insured" (the remaining twenty per cent: persons with disabilities, guaranteed income, widowers / widows, pensioners, the disabled, orphans ...) the co-payment is usually lower. More information, [here](http://www.knack.be/nieuws/wereld/geneesmiddelen-zijn-bijna-nergens-zo-betaalbaar-als-in-belgie/article-normal-654589.html).

The final database includes data from both HAI's reports and these four countries, and you can download it [here](https://docs.google.com/spreadsheets/d/1ksuDMT-B0Y0VwpmRlW4b94GUna9NWkFCph96LNVfgTA/edit?usp=sharing). We have visualized it (sorting the countries by name or [GDP](http://data.worldbank.org/indicator/NY.GDP.PCAP.CD)) using Javascript and D3.js. You can find the web source code [here](https://github.com/civio/medicamentalia-theme).

### Reporting from the field

In Civio we know well that data alone says absolutely nothing. Analysing the database allowed us to draw some interesting conclusions, but the background information and explanations or consequences of the problems of access to medicines were left out. From the beginning we knew we needed reports from the field. To this end we traveled to Ghana to cover the problem of malaria and counterfeit medicines. And to Brazil, to learn about compulsory licensing, an alternative to patents used in that country in 2007\. We also researched the patent system and its alternatives, since the 14 drugs considered essential by the WHO are available as generics, and we didn't want to leave aside one of the major debates on access to medicines worldwide.

## Help us

Medicamentalia is not a finished project, it's a project in motion. We'd love to add more countries and more drugs to the site, always following the same rigorous criteria. If you want to help by providing information about your country, contact us and we'll tell you how. You can also support this and other projects by Civio through [periodic](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4PECHBACVDZ3L) or [one-off](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=R5L232VBWWG62) donations.

**Both the data and the content are licensed as Creative Commons (CC BY). You can use what you need or find interesting with just one condition: give Medicamentalia proper credit and link back to this site. Oh, and one favour: let us know, we'll be happy to hear about it**.

</div>
</div>