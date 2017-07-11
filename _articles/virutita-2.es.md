---
title:            Virutita
subtitle:         Los médicos menos transparentes reciben más dinero
description:      Quienes prefieren ocultar sus relaciones con la industria reciben, de media, cantidades mayores que los que aceptan ser transparentes
home_description: Quienes prefieren ocultar sus relaciones con la industria reciben, de media, cantidades mayores que los que aceptan ser transparentes
img:              articles/home-superbugs.jpg
order:            2
author:           Eva Belmonte
slug:             virutita-2
ref:              virutita-2
lang:             es
---

<div class="container page-content" markdown="1">
  <div class="page-content-container" markdown="1">
La mayor parte de los 181 millones que las farmacéuticas españolas destinaron en 2016 a pagar entradas a congresos, viajes y honorarios de médicos va a parar, ya sea de forma directa o indirecta, a aquellos médicos que han preferido ocultar su nombre. Además, la cuantía media que reciben es mayor que la de aquellos que han aceptado las nuevas reglas de transparencia en el sector. Los opacos reciben, de media, más de cada laboratorio. 

Si los honorarios medios que pagó una farmacéutica a un médico durante 2016 (por uno o más servicios) son de algo más de 800 euros entre quienes sí publican su nombre, esta cifra sube hasta más de 1.000 en el caso de la información agregada. 

Estas diferencias también son destacables en cuotas de inscripción a congresos: para los opacos, de media, 484 euros; 342 para los transparentes. Y, sobre todo, en viajes: los médicos que han preferido ocultar su nombre recibieron de media 600 euros por laboratorio para transporte y alojamiento; los transparentes, 446.

El origen de la publicación de los vínculos económicos entre farmacéuticas y médicos y asociaciones en los países en los que no había legislación sobre este aspecto, como España, está en 2013. Ese año, la EFPIA (European Federation of Pharmaceutical Industries and Associations), de la que Farmaindustria forma parte, aprobó un código de conducta que obliga a sus asociados a publicar, de forma anual, lo que denominaron transferencias de valor. En 2016 se publicaron los primeros datos, referentes a las operaciones de 2015. Este año se publica por segunda vez.

Para Fernando Carballo, de Facme, la publicación de esta información, "en un país que no ha alcanzado los niveles de transparencia global, puede ser un elemento folcklórico". Además, añade, la polémica por cómo cotizan estas cantidades "ha contaminado el proceso".

Si estos pagos se hacen públicos, están accesibles para todos, incluido Hacienda. Las transferencias relacionadas con eventos (cuotas de inscripción, desplazamiento y alojamiento) se entendían hasta el momento como formación del personal sanitario y, por tanto, estaban exentas de IRPF. En abril de 2017, el Tribunal Económico de la Administración Central (TEA) argumentaba que estas cuantías tenían que ser tributadas y tratadas como pagos en especie. Un mes después, la Agencia Tributaria respaldaba la decisión.

Esta posición no ha durado mucho. Las organizaciones médicas han llegado a un acuerdo con el Ministerio de Hacienda para que la próxima legislación sobre IRPF no incluya los gastos para eventos como parte sujeta a tributación. Carballo lo defiende: "Para el profesional, malo era que tuviera que ir a un congreso en fin de semana, malo era que no se lo pague el hospital, malo que tenga que dejar que se lo pague la industria. Pero que encima tenga que pagar él...".

Lo importante, para Carballo, es ir más allá de esos elementos "coyunturales" y hacer una reflexión sobre la formación de los médicos, basada en dos puntos de partida: que el profesional está obligado a mantenerse actualizado y que el sistema nacional de salud no garantiza esa actualización. "Dejación de funciones del empleador", explica Carballo.

### Las diferencias entre laboratorios

Aunque en general la preferencia por permanecer en el anonimato es mayoritaria, también es cierto que el grado de transparencia no es igual en todas las compañías. Ya sea porque han hecho un esfuerzo diferente a la hora de comunicar y convencer a los médicos de que aparecieran sus nombres o porque algunas han tenido mejor suerte que otras, el caso es que hay farmacéuticas que publican casi la totalidad de los nombres de quienes reciben sus "transferencias de valor" y que otras no han publicado ni un solo nombre, como es el caso de Boiron, que pagó cuotas de inscripción a congresos a 772 médicos y no consiguió -si lo intentó- publicar ni uno de esos nombres. 
</div>

<div class="graph-container pharma-transfers-container">
  <p class="graph-container-caption">Nivel de opacidad por laboratorio</p>

  <p>Porcentaje de médicos que ocultan su relación con cada laboratorio</p>
  <ul class="legend"></ul>
  
  <p class="graph-container-title">Cuotas</p>
  <div id="pharma-transfers-charges" class="pharma-transfers beeswarm-graph"></div>

  <p class="graph-container-title">Viajes</p>
  <div id="pharma-transfers-travels" class="pharma-transfers beeswarm-graph"></div>

  <p class="graph-container-title">Honorarios</p>
  <div id="pharma-transfers-fees" class="pharma-transfers beeswarm-graph"></div>

  <p class="graph-container-title">Gastos relacionados con los servicios</p>
  <div id="pharma-transfers-relateds" class="pharma-transfers beeswarm-graph"></div>

  <div class="row pharma-transfers-footer">
    <div class="col-sm-4">
      <div id="pharma-selector" class="form-group">
        <label>Filtra por farmaceútica</label>
        <select class="form-control">
          <option value="-1">Todas</option>
        </select>
      </div>
    </div>
    <div class="size-legend col-sm-8">
      <p><strong>Tamaño</strong>: número de médicos que reciben pagos de cada farmaceútica</p>
      <ul>
        <li class="sm"><span class="circle"></span> 100</li>
        <li class="m"><span class="circle"></span> 1000</li>
        <li class="l"><span class="circle"></span> 10000</li>
      </ul>
    </div>
  </div>
 
  <div id="pharma-transfers-tooltip" class="tooltip top" role="tooltip">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner">
      <p class="title"></p>
      <div class="description">
        <p>Publica pagos a <span class="total"></span> médicos<br/>Un <span class="value"></span> de ellos oculta su nombre</p>
        <p class="subsidiaries-cont">Incluye <span class="subsidiaries"></span></p>
      </div>
    </div>
  </div>
</div>

<div class="page-content-container" markdown="1">
La mayoría de las compañías está por encima del 80% de opacidad. Es decir, solo publican los nombres de entre el 10 y el 20% de los médicos con los que tienen relaciones económicas en cada uno de los cuatro apartados. Pfizer, por ejemplo, está por encima del 90% en las cuatro categorías.

Pasando por laboratorios más equilibrados, como Novartis, que ha publicado algo más de la mitad de los nombres, llegamos al pequeño grupo de empresas con unos porcentajes de publicación individual muy elevados. Es el caso de Glaxo, que solo oculta el 3% de los nombres de los médicos a los que paga honorarios. Otra de las grandes, Janssen, por su parte, ha conseguido publicar más del 80% de las transferencias de forma individualizada.

### Sin reglas públicas

El código que regula esta publicación es un ejercicio de autoregulación de la industria y no una norma emanada desde las administraciones públicas. Es un modelo "impuesto unilateralmente", según Carballo, "parcial y de parte". José Zamarriego es director de la Unidad de Supervisión de Conducta de Farmaindustria. Coincide con el presidente de las asociaciones cientificas en la falta de cultura de la transparencia en España pero afirma que, si se aprueba un reglamento que lo regule, tiene que ir más allá de lo que ellos han creado y no dar pasos atrás.

El [artículo 76](https://www.boe.es/buscar/act.php?id=BOE-A-2006-13554#a76
) de la Ley de garantías y uso racional de los medicamentos y productos sanitarios, aprobada en 2006, ya establecía por entonces que "las ofertas de premios, becas, contribuciones y subvenciones a reuniones, congresos, viajes de estudio y actos similares por cualquier persona, física o jurídica, relacionada con la fabricación, elaboración, distribución, prescripción y dispensación de medicamentos y productos sanitarios, **se harán públicas en la forma que se determine reglamentariamente**". Aunque solo se refería a una parte de las cuatro categorías (entradas a congresos y viajes, pero no honorarios), la norma que debía establecer cómo se tenía que publicar esta información nunca se desarrolló.

<p class="credits" markdown="1">Este artículo forma parte de una investigación en marcha de Civio sobre la relación entre farmacéuticas, médicos, asociaciones y entidades públicas.</p>

</div>
</div>