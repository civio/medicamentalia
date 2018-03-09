---
category:   contraceptives
title:      Methodology
img:        articles/home-contraceptives-team.jpg
order:      4
slug:       team
ref:        contraceptives-team
lang:       en
draft:      true
---

<div class="container page-content" markdown="1">
<div class="page-content-container" markdown="1">

### About us

Medicamentalia-Contraceptives is an international journalistic investigation by [Civio](www.civio.es) on birth control access and barriers. We have combined data journalism with on-the-ground reporting to tell the stories of the women behind the statistics, to gather their opinions about birth control access and their freedom to decide about their bodies. This installment follows in the footsteps of two predecessors, focused on [access to essential medicines](https://medicamentalia.org/access/) and [access to vaccines](https://medicamentalia.org/vaccines/) around the world.

This project is funded by [Journalism Grants](https://journalismgrants.org/), which is financed by the Bill and Melinda Gates Foundation. As with previous publications, **neither organisation has influenced in any way our reporting** nor the content of this project. Nor have they had advance review of the project. 

The team behind Medicamentalia is:

+ **Eva Belmonte.** Journalist. Project management, research, creating and analysing databases, reporting in Mexico, The Gambia, and Senegal, writing and editing.
+ **Raúl Díaz Poblete.** Developer. Website development, interaction design, data analysis and visualisation.
+ **María Álvarez del Vayo.** Journalist. Research, creating and analysing databases, reporting in Israel and writing.
+ **Miguel Ángel Gavilanes.** Journalist. Research, creating and analysing databases, reporting in Israel and writing.
+ **Verónica Ramírez.** Journalist. Research, reporting in The Gambia and Senegal and writing.
+ **Javier de Vega.** Journalist. Research, writing, editing and communications.
+ **David Cabo.** Developer. Data extraction and creating and analysing databases.
+ **Lucas Laursen.** Journalist. Translation and English copy-editing.
+ **Amir Campos.** Project management.
+ **Giulio Piantadosi**. Video editing.
+ **Maya Siminovich.** Video and production in Israel.
+ **Pablo Duer.** Production in Israel.
+ **Muna Faye.** Video and photography in The Gambia. 
+ **Modou Lamin.** Fixing and production in The Gambia.
+ **Malyka Diagana.** Video and photography in Senegal.


And many more friends and colleagues have helped us to reach women in points beyond. They are:

+ **Carmen Santamaría**, in Argentina.
+ **Alice Campanille**, in Colombia.
+ **Petra Piitulainen**, in Finland.
+ **Elsa Cabria y Ximena Villagrán**, in Guatemala.
+ **Marta Orosz**, of Correctiv in Germany.


{: #acknowledgements}
#### Acknowledgments

This project would have been impossible without sponsorship from the European Journalism Centre, which awarded us our third Journalism Grant.

Thanks also to our *media partners* who supported us before seeing the final product and who help us reach so much farther.

With each installment of Medicamentalia we encounter complex issues that require rigorous fact-checking. So in addition to consulting dozens of scientific papers we have consulted experts who have generously helped us throughout. 

**Jaime Manzano**, a pharmacist at Médicos Sin Fronteras offered to give us a hand and he did that and beyond: he helped us understand the main problems on the ground and technical issues with contraceptives

**[Clara Lis](https://twitter.com/claratimonel)**, a pharmacist specialised in sexual health and reproductive justice, gave us a masterclass on how women deal with this issue and possible focuses for our investigation. The fact that Medicamentalia-Contraceptives is more focused on rights than on the stricly medical or economic aspects is, in part, thanks to our conversation with her.

And **Bea Hernández** helped us to use R to deal with raw USAID DHS data. And she did it because she's good people.  

And of course, thanks to the people who shared their time and experiences with us in interviews, especially the dozens of women who decided to open up about their feelings and tell us their most personal stories, above all in those places where talking about contraceptives with strangers isn't easy. Thank you, again, for your generosity.


{% include caption.html img="contraceptives/forum-for-african-woman-gambia.jpg" caption="" fullWidth=true %}


### Method

{: #data}
#### The data

The two main sources of data are the [World Contraceptive Use](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017.shtml) of the Population Division of the United Nations and the Demographic and Health Surveys ([DHS](https://www.statcompiler.com/en/)) of the United States Agency for International Development (USAID). We have analysed and combined these with other data, such as income levels or family planning difficulties. Both are based on surveys of women. 

Given, for example, the UN's [method](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017/UNPD_WCU2017_Methodology.pdf), it's important to note two things: 

1. The population they use to calculate usage of and unmet need for birth control are **sexually active women between the ages of 15 and 49**. This is usually married or partnered women and those who have reported sexual activity in the previous months, depending on the country. The details for each country are available with the original raw data, which may also include other nuances. The 2017 data, for example, [is here](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017/UNPD_WCU2017_Country_Data_Survey-Based.xlsx). 

2. **Unmet needs** refers to the women who, although they want to limit or space their pregnancies, do not use any method of birth control, including traditional ones such as the pull-out method. As elsewhere, this is a fraction of sexually active women aged 15 to 49.

{: #contraceptives-use}
#### Use of contraceptives by country

To find which contraceptives are most common in each country, we have used the 2017 statistics published by the *Population Division* of the United Nations (UN). We have selected countries with data available from 2007 onward in the [World Contraceptive Use 2017](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017.shtml) report. For the remaining countries (those with older data), we have used 2015 estimates. This is because that is only UN source that breaks down the data by method  [annex](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2015/annex-tables.xlsx).

{% include caption.html img="contraceptives/excel-data.jpg" caption="" align="alignright" %}

In both cases we have converted the data from usage as a percentage of the surveyed women to **birth control methods as a percentage of women who use any method.** The objective is to show more clearly the distribution of methods in each country. If we reported the rates as fractions of all reproductive-age women, countries with low overall birth control usage rates would be swamped by those with higher rates. This follows [Family Planning 2020](http://www.familyplanning2020.org/)'s calculation. 

We also include lactational amenorrhea among modern methods instead of traditional methods, following the UN's latest policy.

{: #global-data}
#### Global data and unmet needs

For global usage data (visible in the infographic with the female figures) and the unmet needs by country (the scatterplot) we have used [UN](http://www.un.org/en/development/desa/population/theme/family-planning/cp_model.shtml) estimates published in 2017. 

For global usage we have used the most recent data (2017). For unmet needs we used 2016 data since it is the most recent year with available [national income data](https://blogs.worldbank.org/opendata/new-country-classifications-income-level-2017-2018) for comparison. The source for the income data is the [World Bank](https://datahelpdesk.worldbank.org/knowledgebase/articles/378831-why-use-gni-per-capita-to-classify-economies-into). 

{: #barriers}
#### Barriers

The global barrier data cited in the text are from the 2016 Guttmacher Institute [report](https://www.guttmacher.org/report/unmet-need-for-contraception-in-developing-countries) *Unmet need for contraception in developing countries: examining women’s reasons for not using a method*. In our graphics and for the country-level data we use in the application we needed to use the raw DHS data.

We use microdata downloaded from DHS in Stata format. We imported these into R, where we performed our analysis. We calculate the distribution in the variable `v375a`, "Main reason not using a method", but only for values determined in variable `v624`, "Unmet need". Specifically, for values 1 ("Unmet need to space") and 2 ("Unmet need to limit").

{: #application}
#### Application

For the application, where our priority is to offer specific data for each country consulted, we have been able to be more precise. For countries in the DHS, where have been able to work with the raw data, we have used that data, which allows us to analyse birth control methods by income, education, urban or rural, and age.

For countries not in the DHS, we use UN data, which does not allow the same analysis. For the percentage of unmet needs, we used real data if survey data was available from 2007 onward. If not, we used estimates.

{: #website}
#### The website

This website is developed with [Jekyll](https://jekyllrb.com/){:target="_blank"}nd uses Javascript and [D3.js](https://d3js.org/){:target="_blank"} for the data visualizations. You can find the code of the web in our [Github repository](https://github.com/civio/medicamentalia){:target="_blank"}.


{% include caption.html img="contraceptives/web-code.jpg" caption="" fullWidth=true %}


### Collaboration and reproduction

Medicamentalia Vaccines is not a closed project. If you have relevant information or **you work for an organisation that wishes to reproduce all or part** of the content, [write to us](mailto:contacto@civio.es) and we will help you to make it happen.

You can collaborate, for example, by helping us find the information about the prices that your country pays for vaccines. We will include them in our database but, if you are a journalist, we'll give you time to write your own articles before publishing the new infomation.

**The database and all materials produced by the project (i.e. not including photographies provided by third parties) are Creative Commons (CC BY). You may use anything that you need or that interests you on one condition: you must attribute and link to Medicamentalia**. We also ask that you tell us about it! We would love to hear from you.

</div>
</div>