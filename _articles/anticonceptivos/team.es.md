---
category:   anticonceptivos
title:      Metodología
img:        articles/home-contraceptives-team.jpg 
order:      4
slug:       nosotros
ref:        contraceptives-team
lang:       es
draft:      true
---

<div class="container page-content" markdown="1">
<div class="page-content-container" markdown="1">

### Nosotros

Medicamentalia-Anticonceptivos es una investigación periodística internacional de [Civio](https://civio.es) centrada en el uso de anticonceptivos, el acceso a ellos y las barreras que lo frenan. Hemos aunado periodismo de datos con reporterismo en el terreno para contar las historias de las mujeres detrás de las estadísticas, recoger sus opiniones sobre el acceso a los anticonceptivos y hablar de la libertad de decisión sobre sus cuerpos. Esta entrega continúa el camino marcado por sus dos predecesoras, centradas en el [acceso a los medicamentos esenciales](https://medicamentalia.org/acceso/) y en el [acceso a las vacunas](https://medicamentalia.org/vacunas) en el mundo.

La financiación de este proyecto parte de una beca de [Journalism Grants](https://journalismgrants.org/), financiado por la Fundación Bill y Melinda Gates. Como en las anteriores publicaciones, **ni uno de estos fondos han influenciado de ningún modo la investigación** ni los contenidos. De hecho, han tenido acceso a este trabajo a la vez que los lectores. 

El equipo detrás de Medicamentalia Anticonceptivos:

+ **Eva Belmonte.** Periodista. Dirección de proyecto, investigación, creación y análisis de bases de datos, trabajo de campo en México, Gambia y Senegal, reportajes y edición.
+ **Raúl Díaz Poblete.** Desarrollador. Desarrollo web, diseño de interfaz, análisis y visualización de datos.
+ **María Álvarez del Vayo.** Periodista. Investigación, creación y análisis de bases de datos, trabajo de campo en Israel y reportajes.
+ **Miguel Ángel Gavilanes.** Periodista. Investigación, creación y análisis de bases de datos, trabajo de campo en Israel y reportajes.
+ **Verónica Ramírez.** Periodista. Investigación, trabajo de campo en Gambia y Senegal y reportajes.
+ **Javier de Vega.** Periodista. Investigación, reportajes, edición y comunicación.
+ **David Cabo.** Desarrollador. Extracción, creación y análisis de bases de datos.
+ **Lucas Laursen.** Periodista. Traducción y edición en inglés.
+ **Amir Campos.** Gestión de proyecto.
+ **Giulio Piantadosi**. Edición de vídeo.
+ **Maya Siminovich.** Vídeo y producción en Israel.
+ **Pablo Duer.** Producción en Israel.
+ **Muna Manneh-Fye.** Vídeo y fotografía en Gambia. 
+ **Modou Lamin.** Traslados y producción en Gambia.
+ **Malyka Diagana.** Vídeo y fotografía en Senegal.
+ **Antonio Guzmán.** Diseñador. Ilustraciones.


Además, para llegar a más mujeres en otras latitudes, hemos contado con amigos y colaboradores. Son:

+ **Carmen Santamaría**, desde Argentina.
+ **Petra Piitulainen**, desde Finlandia.
+ **Elsa Cabria y Ximena Villagrán**, desde Guatemala.
+ **Marta Orosz**, de Correctiv, desde Alemania.

#### Agradecimientos {#agradecimientos}

Este proyecto no hubiera sido posible sin el patrocinio del European Journalism Centre, que, por tercera vez, nos otorgó una de sus becas de Journalism Grants.

Gracias, también, a nuestros *media partners* que apoyaron, antes de ver ningún material, la publicación de este trabajo, y que nos ayudan a llegar mucho más lejos.

Con cada capítulo de Medicamentalia nos abrimos ante realidades complejas que requieren una profusa documentación. Por ello, además de consultar decenas de *papers* científicos y sociológicos, hemos tenido el privilegio de contar con especialistas que nos han ayudado a lo largo de este procedimiento. 

**Jaime Manzano**, farmacéutico que trabaja en Médicos Sin Fronteras, se ofreció a echar una mano y lo hizo, ¡y mucho!: nos ayudó entender los principales problemas que se encuentran sobre el terreno y los asuntos más técnicos vinculados con los anticonceptivos. **[Clara Lis](https://twitter.com/claratimonel)**, farmacéutica especializada en salud sexual y justicia reproductiva, nos dio una clase magistral sobre cómo se enfrentan las mujeres a este asunto y los posibles enfoques. Que Medicamentalia Anticonceptivos esté más centrado en derechos que en la parte puramente médica o económica es, en parte, gracias a su empuje en esa conversación.  

Además, **Bea Hernández** nos ayudó a usar R para tratar con los datos brutos de DHS. Y lo hizo porque es muy buena gente.  

Y cómo no, gracias a todas aquellas personas que compartieron con nosotros su tiempo y experiencia en las entrevistas. En especial, a las decenas de mujeres que decidieron abrir sus sentimientos y contarnos sus historias más personales, sobre todo en aquellos contextos en los que hablar de anticonceptivos con desconocidos no era nada fácil. Gracias, de nuevo, por su generosidad.

{% include caption.html img="contraceptives/forum-for-african-woman-gambia.jpg" caption="" fullWidth=true %}

<a name="metodologia">

### Metodología

#### Los datos {#datos}

Las dos fuentes principales de los datos son: el [World Contraceptive Use](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017.shtml) de la División de Población de Naciones Unidas; y los Demographic and Health Surveys ([DHS](https://www.statcompiler.com/en/)) de la agencia de desarrollo de Estados Unidos. Hemos analizado, tratado y combinado estas fuentes con otras, como las que marcan niveles de renta o dificultades de las mujeres relacionadas con la falta de planificación familiar. Ambos están basados en encuestas a mujeres. 

Tras estudiar a fondo su metodología ([aquí](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017/UNPD_WCU2017_Methodology.pdf), por ejemplo, la de Naciones Unidas), es importante recalcar dos cosas: 

1. La población sobre la que se calculan los datos de uso y de necesidades no cubiertas son **mujeres de 15 a 49 años sexualmente activas**, teniendo en cuenta que normalmente se trata de mujeres casadas o en pareja, o mujeres casadas y aquellas que han tenido relaciones sexuales en los últimos meses, según el país. El detalle de las fuentes de cada país se puede consultar en los datos brutos originales ([aquí](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017/UNPD_WCU2017_Country_Data_Survey-Based.xlsx), por ejemplo, los de 2017), que pueden presentar matices en la muestra. 

2. Las necesidades no cubiertas (*unmet needs*, en inglés) es el porcentaje de mujeres que, aunque quieren limitar o espaciar sus embarazos, no usan ningún método anticonceptivo, ni siquiera uno tradicional, como la marcha atrás. Se calcula, como el resto, sobre la base de las mujeres de 15 a 49 años sexualmente activas.  


#### Uso de anticonceptivos por país {#uso-anticonceptivos}

Para conocer cuáles son los métodos anticonceptivos más elegidos en cada país, hemos utilizado las estadísticas publicadas en 2017 por la *Population Division* de Naciones Unidas (ONU). De los datos recogidos en su [World Contraceptive Use 2017](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2017.shtml), hemos seleccionado los de aquellos países cuyas encuestas –la base de este informe– fueron recogidas a partir de 2007. Para los datos de los países restantes (aquellos con datos más antiguos), hemos utilizado estimaciones para el año 2015 de la prevalencia de uso de cada método anticonceptivo. Esto es debido a que la única fuente de las Naciones Unidas que contiene datos desagregados por anticonceptivo son los [anexos](http://www.un.org/en/development/desa/population/publications/dataset/contraception/wcu2015/annex-tables.xlsx) de su informe de 2015.

{% include caption.html img="contraceptives/excel-data.jpg" caption="" align="alignright" %}

En ambos casos, hemos tratado los datos para pasar del porcentaje de uso de cada método sobre el total de mujeres encuestadas a **un *mix* de uso de anticonceptivos, esto es, el porcentaje de uso de cada método entre las mujeres que usan alguno**. El objetivo es mostrar de una forma más clara cómo es la distribución de métodos por país, puesto que si lo tratábamos sobre el total de mujeres en edad reproductiva aquellos estados con un uso bajo de anticonceptivos quedarían absorbidos por aquellos con tasas de uso general más altas. Este cálculo está basado en el que realizan organizaciones como [Family Planning 2020](http://www.familyplanning2020.org/). 

Como hace Naciones Unidas en sus últimos estudios, incluímos la Amenorrea de la lactancia entre los métodos moderno y no en tradicionales. 


#### Datos globales y necesidades no cubiertas {#datos-globales}

Para los datos mundiales de uso (los que puedes ver en la infografía de mujeres) y las necesidades no cubiertas por país (en el scatterplot) hemos utilizado las **estimaciones** de [UN](http://www.un.org/en/development/desa/population/theme/family-planning/cp_model.shtml) publicadas en 2017. 

Para el uso global, hemos utilizado el dato más reciente (2017); para las necesidades no cubiertas, el de 2016, puesto que este es el último año del que tenemos [niveles de renta por país](https://blogs.worldbank.org/opendata/new-country-classifications-income-level-2017-2018) con los que vincularlos. La fuente de estos últimos datos es el [Banco Mundial](https://datahelpdesk.worldbank.org/knowledgebase/articles/378831-why-use-gni-per-capita-to-classify-economies-into). 

#### Barreras {#barreras}

Los datos globales de barreras que se nombran en el texto salen del [estudio](https://www.guttmacher.org/report/unmet-need-for-contraception-in-developing-countries) *Unmet need for contraception in developing countries: examining women’s reasons for not using a method*, del Guttmacher Institute. Pero, para nuestros gráficos y para los datos por países que usamos en la aplicación, necesitábamos tratar los datos en crudo de DHS. 

Estamos usando los microdatos descargados de DHS en formato Stata. Posteriormente los importamos a R, donde hacemos las manipulaciones necesarias. Estamos calculando la distribución en la variable `v375a`, "Main reason not using a method" ("Principal razón para no usar un método", en español), pero solo para unos valores determinados en la variable `v624`, "Unmet need" ("Necesidades no cubiertas", en español). En concreto, para los valores 1 ("Unmet need to space"; "Necesidad no cubierta para espaciar", en español) y 2 ("Unmet need to limit"; "Necesidad no cubierta para limitar", en español).

#### Aplicación {#aplicacion}
Para la aplicación, en la que lo importante es ofrecer los datos concretos de cada país que se consulte, hemos podido ser más precisos. Para los países que están en DHS, donde podíamos tratar los datos en bruto, hemos usado DHS, que nos permite desglosar por niveles de renta, estudios, entorno y edad.

Para los que no estén en DHS, usamos los datos de Naciones Unidas (que no permiten ese desglose). En el caso del porcentaje de necesidades no cubiertas, utilizamos los datos reales si las encuestas se han realizado a partir de 2007 (esto es, en los últimos diez años). Si no, utilizamos las estimaciones.

#### La web {#web}

Esta página web está desarrollada con [Jekyll](https://jekyllrb.com/){:target="_blank"} y utiliza Javascript y [D3.js](https://d3js.org/){:target="_blank"} para las visualizaciones. Puedes encontrar el código de la web en nuestro [repositorio de Github](https://github.com/civio/medicamentalia){:target="_blank"}.


{% include caption.html img="contraceptives/web-code.jpg" caption="" fullWidth=true %}


### Colabora y republica

Medicamentalia-Anticonceptivos no es un proyecto cerrado. Si tienes información relevante o **trabajas en un medio que quiere republicar todo o parte** del contenido, [escríbenos](mailto:contacto@civio.es) y te ayudamos a ponerlo en marcha. 

**Tanto la base de datos como todos los materiales propios del proyecto son Creative Commons (CC BY) -con la excepción de alguna imagen externa. Puedes usar lo que necesites o te interese con una única condición: que cites y enlaces a Medicamentalia**. Si tienes cualquier duda sobre la licencia o los datos, escríbenos y te contamos. 

</div>
</div>