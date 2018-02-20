---
category:         anticonceptivos
title:            Ponte en su piel
subtitle:         ...
description:      ...
home_description: ...
img:              articles/home-contraceptives.jpg
order:            1
highlighted:      true
author:           ...
pub_date:         2018-02-20
slug:             app
ref:              app
lang:             es
---

<div class="container page-content">
<div class="page-content-container" markdown="1">

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

<div class="graph-container">
  <div id="contraceptives-app">
    <div>
      <p>Selecciona un país</p>
      {% include contraceptives/countries-select.html %}
    </div>
    <div class="contraceptives-app-data-container">{% include contraceptives/app-item.html img='woman' %}</div>
    <div class="contraceptives-app-filters">
      <p>Filtra según</p>
      <a class="btn btn-default" href="#contraceptives-filter-0" role="button" title="Entorno urbano o rural">Entorno urbano o rural</a>
      <a class="btn btn-default" href="#contraceptives-filter-1" role="button" title="Edad">Edad</a>
      <a class="btn btn-default" href="#contraceptives-filter-2" role="button" title="N ivel de estudios">Nivel de estudios</a>
      <a class="btn btn-default" href="#contraceptives-filter-3" role="button" title="Nivel de renta">Nivel de renta</a>
    </div>
  </div>
</div>
</div>


<div class="graph-container">

<!-- URBANO / RURAL -->
<div id="contraceptives-filter-0" class="contraceptives-filter">
  <div class="row">
    <div id="contraceptives-filter-0-1" class="col-sm-6">
      {% include contraceptives/app-item.html title='Entorno urbano' img='woman-urban' %}
    </div>
    <div id="contraceptives-filter-0-2" class="col-sm-6">
      {% include contraceptives/app-item.html title='Entorno rural' img='woman-rural' %}
    </div>
  </div>
</div>


<!-- EDAD -->
<div id="contraceptives-filter-1" class="contraceptives-filter">
  <div class="row">
    <div id="contraceptives-filter-1-1" class="col-sm-4">
      {% include contraceptives/app-item.html title='Entre 15 y 24 años' img='woman-younger' %}
    </div>
    <div id="contraceptives-filter-1-2" class="col-sm-4">
      {% include contraceptives/app-item.html title='Entre 25 y 34 años' img='woman' %}
    </div>
    <div id="contraceptives-filter-1-3" class="col-sm-4">
      {% include contraceptives/app-item.html title='Entre 35 y 49 años' img='woman-older' %}
    </div>
  </div>
</div>

<!-- ESTUDIOS -->
<div id="contraceptives-filter-2" class="contraceptives-filter">
  <div class="row">
    <div id="contraceptives-filter-2-0" class="col-sm-3">
      {% include contraceptives/app-item.html title='Sin educación' img='woman' %}
    </div>
    <div id="contraceptives-filter-2-1" class="col-sm-3">
      {% include contraceptives/app-item.html title='Educación primaria' img='woman-primary' %}
    </div>
    <div id="contraceptives-filter-2-2" class="col-sm-3">
      {% include contraceptives/app-item.html title='Educación secundaria' img='woman-secondary' %}
    </div>
    <div id="contraceptives-filter-2-3" class="col-sm-3">
      {% include contraceptives/app-item.html title='Educación superior' img='woman-superior' %}
    </div>
  </div>
</div>

<!-- INGRESOS -->
<div id="contraceptives-filter-3" class="contraceptives-filter">
  <div class="row">
    <div id="contraceptives-filter-3-1" class="col-sm-3">
      {% include contraceptives/app-item.html title='Ingresos bajos' img='woman' %}
    </div>
    <div id="contraceptives-filter-3-2" class="col-sm-3">
      {% include contraceptives/app-item.html title='Ingresos medios-bajos' img='woman-income-low-medium' %}
    </div>
    <div id="contraceptives-filter-3-3" class="col-sm-3">
      {% include contraceptives/app-item.html title='Ingresos medios' img='woman-income-medium' %}
    </div>
    <div id="contraceptives-filter-3-4" class="col-sm-3">
      {% include contraceptives/app-item.html title='Ingresos medios-altos' img='woman-income-medium-high' %}
    </div>
    <div id="contraceptives-filter-3-5" class="col-sm-3">
      {% include contraceptives/app-item.html title='Ingresos altos' img='woman-income-high' %}
    </div>
  </div>
</div>

</div>

</div>