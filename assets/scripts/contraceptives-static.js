(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.ContraceptivesApp = (function() {
    ContraceptivesApp.prototype.filter_keys = {
      'contraceptives-filter-0': 'residence',
      'contraceptives-filter-1': 'age',
      'contraceptives-filter-2': 'education',
      'contraceptives-filter-3': 'wealth'
    };

    ContraceptivesApp.prototype.dhs_countries = {
      'AFG': {
        'name': 'AFIR70DT',
        'year': '2017'
      },
      'ALB': {
        'name': 'ALIR50DT',
        'year': '2008-09'
      },
      'ARM': {
        'name': 'AMIR61DT',
        'year': '2010'
      },
      'AGO': {
        'name': 'AOIR71DT',
        'year': '2015-16'
      },
      'AZE': {
        'name': 'AZIR52DT',
        'year': '2006'
      },
      'BGD': {
        'name': 'BDIR72DT',
        'year': '2014'
      },
      'BEN': {
        'name': 'BJIR51DT',
        'year': '2006'
      },
      'BOL': {
        'name': 'BOIR51DT',
        'year': '2008'
      },
      'BDI': {
        'name': 'BUIR61DT',
        'year': '2010'
      },
      'COD': {
        'name': 'CDIR61DT',
        'year': '2013-14'
      },
      'COG': {
        'name': 'CGIR60DT',
        'year': '2011-12'
      },
      'CIV': {
        'name': 'CIIR62DT',
        'year': '2011-12'
      },
      'CMR': {
        'name': 'CMIR61DT',
        'year': '2011'
      },
      'COL': {
        'name': 'COIR71DT',
        'year': '2015-16'
      },
      'DOM': {
        'name': 'DRIR61DT',
        'year': '2013'
      },
      'EGY': {
        'name': 'EGIR61DT',
        'year': '2014'
      },
      'ETH': {
        'name': 'ETIR70DT',
        'year': '2016'
      },
      'GHA': {
        'name': 'GHIR72DT',
        'year': '2014'
      },
      'GMB': {
        'name': 'GMIR60DT',
        'year': '2013'
      },
      'GIN': {
        'name': 'GNIR62DT',
        'year': '2012'
      },
      'GTM': {
        'name': 'GUIR71DT',
        'year': '2014-15'
      },
      'GUY': {
        'name': 'GYIR5IDT',
        'year': '2009'
      },
      'HND': {
        'name': 'HNIR62DT',
        'year': '2011-12'
      },
      'HTI': {
        'name': 'HTIR61DT',
        'year': '2012'
      },
      'IND': {
        'name': 'IAIR71DT',
        'year': '2015'
      },
      'IDN': {
        'name': 'IDIR63DT',
        'year': '2012'
      },
      'JOR': {
        'name': 'JOIR6CDT',
        'year': '2012'
      },
      'KEN': {
        'name': 'KEIR70DT',
        'year': '2014'
      },
      'KHM': {
        'name': 'KHIR73DT',
        'year': '2014'
      },
      'LBR': {
        'name': 'LBIR6ADT',
        'year': '2013'
      },
      'LSO': {
        'name': 'LSIR71DT',
        'year': '2014'
      },
      'MAR': {
        'name': 'MAIR43DT',
        'year': '2003-04'
      },
      'MDG': {
        'name': 'MDIR51DT',
        'year': '2008-09'
      },
      'MLI': {
        'name': 'MLIR53DT',
        'year': '2006'
      },
      'MMR': {
        'name': 'MMIR71DT',
        'year': '2016'
      },
      'MWI': {
        'name': 'MWIR7HDT',
        'year': '2015-16'
      },
      'MOZ': {
        'name': 'MZIR62DT',
        'year': '2011'
      },
      'NGA': {
        'name': 'NGIR6ADT',
        'year': '2013'
      },
      'NER': {
        'name': 'NIIR51DT',
        'year': '2006'
      },
      'NAM': {
        'name': 'NMIR61DT',
        'year': '2013'
      },
      'NPL': {
        'name': 'NPIR7HDT',
        'year': '2016'
      },
      'PER': {
        'name': 'PEIR6IDT',
        'year': '2012'
      },
      'PHL': {
        'name': 'PHIR61DT',
        'year': '2013'
      },
      'PAK': {
        'name': 'PKIR61DT',
        'year': '2012-13'
      },
      'RWA': {
        'name': 'RWIR70DT',
        'year': '2015'
      },
      'SLE': {
        'name': 'SLIR61DT',
        'year': '2013'
      },
      'SEN': {
        'name': 'SNIR6DDT',
        'year': '2012-13'
      },
      'STP': {
        'name': 'STIR50DT',
        'year': '2008'
      },
      'SWZ': {
        'name': 'SZIR51DT',
        'year': '2006'
      },
      'TCD': {
        'name': 'TDIR71DT',
        'year': '2014-15'
      },
      'TGO': {
        'name': 'TGIR61DT',
        'year': '2013-14'
      },
      'TJK': {
        'name': 'TJIR61DT',
        'year': '2012'
      },
      'TLS': {
        'name': 'TLIR61DT',
        'year': '2009-10'
      },
      'TZA': {
        'name': 'TZIR7HDT',
        'year': '2015-16'
      },
      'UGA': {
        'name': 'UGIR60DT',
        'year': '2011'
      },
      'ZMB': {
        'name': 'ZMIR51DT',
        'year': '2007'
      },
      'ZWE': {
        'name': 'ZWIR71DT',
        'year': '2015'
      }
    };

    ContraceptivesApp.prototype.sentences = {
      'es': {
        'ALB': 'La marcha atrás es el primer método anticonceptivo de Albania. Además, se trata del segundo país donde existe mayor oposición de la propia mujer, la pareja o la religión a tomar anticonceptivos.',
        'ARG': '<a href="https://www.clarin.com/sociedad/campana-ley-aborto-comenzo-2005-proyecto-presento-veces_0_BJvdi0nPz.html">Unas cinco mil mujeres marcharon en febrero de 2018 frente al Congreso argentino para pedir la legalización del aborto.</a>',
        'AUS': '<a href="http://www.abc.net.au/news/health/2017-07-22/natural-methods-of-contraception-on-the-rise-in-australia/8683346">Muchos australianos están volviendo a utilizar métodos tradicionales de anticoncepción, según un estudio de Monash University.</a>',
        'BEL': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">Bélgica donó 10 millones de euros para la campaña <i>She Decides</i>, lanzada por el Gobierno holandés para contrarrestar la retirada de fondos para planificación familiar de Trump.</a>',
        'BOL': '<a href="https://www.efe.com/efe/america/sociedad/la-vergüenza-y-el-estigma-de-pedir-preservativos-en-bolivia//20000013-3265652">Farmacias de Bolivia implementaron códigos secretos para pedir preservativos y evitar el estigma de comprar estos anticonceptivos.</a>',
        'COL': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html">El Gobierno chino ofrece la retirada gratuita de DIUs después de la política del hijo único.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures">El Salvador es el único país del mundo donde abortar está penado con cárcel.</a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html">El ayuntamiento de Helsinki proporciona anticonceptivos de manera gratuita a los jóvenes menores de 25 años.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops">El uso de las pastillas anticonceptivas se ha reducido en Francia desde 2010.</a>',
        'GMB': 'En Gambia, muchas mujeres utilizan un método tradicional que consiste en atar a la cintura una cuerda, una rama, o un papelito con o sin frases del Corán.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577">Un proyecto alemán facilita anticonceptivos de forma gratuita a mujeres de más de 20 años con ingresos bajos.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco">La religión influye en la educación sexual de los jóvenes guatemaltecos.</a>',
        'ISR': 'En los sectores judíos más ortodoxos, solo pueden usarse los anticonceptivos si el rabino da su permiso a la mujer.',
        'JPN': 'Japón, aunque se encuentra en el grupo de países con renta alta, es la excepción: las necesidades no cubiertas con anticonceptivos está al nivel de países con rentas bajas.',
        'PRK': 'El 95% de mujeres que utilizan anticonceptivos en Corea del Norte han elegido el DIU. Se trata del mayor porcentaje de uso a nivel mundial.',
        'NLD': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">El gobierno holandés lanza el proyecto <i>She Decides</i> para contrarrestar la retirada de fondos para planificación familiar de Trump.</a>',
        'PER': '<a href="https://interactive.quipu-project.com/#/es/quipu/intro">En la época de los 90, durante el gobierno de Fujimori, más de 250.000 mujeres fueron esterilizadas sin su consentimiento.</a>',
        'PHL': '<a href="https://www.theguardian.com/global-development/2017/jul/10/how-bitter-herbs-and-botched-abortions-kill-three-women-a-day-in-the-philippines"> En un país donde el aborto del está prohibido, tres mujeres mueren al día por complicaciones derivadas de intervenciones ilegales.</a>',
        'POL': '<a href="https://www.amnesty.org/en/latest/news/2017/06/poland-emergency-contraception-restrictions-catastrophic-for-women-and-girls/">El Gobierno polaco da un paso atrás y se convierte en el único país de la Unión Europea donde la pastilla del día después está sujeta a prescripción.</a>',
        'SSD': '<a href="https://www.theguardian.com/global-development/2017/may/25/every-year-i-give-birth-war-driving-contraception-crisis-sudan-nuba-mountains">La guerra en Sudán está creando una crisis en el acceso a anticonceptivos.</a>',
        'ESP': '<a href="http://cadenaser.com/emisora/2017/09/19/radio_madrid/1505842932_131031.html">Madrid es la única comunidad que no financia anticonceptivos con sus fondos.</a>',
        'TUR': '<a href="http://www.bbc.com/news/world-europe-36413097">Erdogan declara que la planificación familiar no es para los musulmanes.</a>',
        'UGA': '<a href="https://www.newvision.co.ug/new_vision/news/1458882/uganda-facing-150-million-condom-shortfall">En 2017, el Ministerio de Salud de Uganda declaraba un desabastecimiento de 150 millones de preservativos masculinos.</a>',
        'GBR': '<a href=https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform">En Irlanda es ilegal abortar a no ser que haya un riesgo real de salud para la madre.</a>',
        'USA': '<a href="https://www.nytimes.com/2018/01/18/us/health-care-office-abortion-contraception.html">Trump da a los médicos libertad para negarse a realizar procedimientos en contra de sus creencias religiosas, como el aborto.</a>',
        'VEN': '<a href="http://www.bbc.com/mundo/noticias-america-latina-42635412">La escasez y el precio elevado de los anticonceptivos en Venezuela influye en el aumento de embarazos no deseados.</a>',
        'ZMB': '<a href="https://www.ideo.org/project/diva-centres">Un proyecto en Zambia  une la manicura y los anticonceptivos.</a>'
      },
      'en': {
        'ALB': 'Withdrawn is the most used contraceptive method by Albanian women. Furthermore, it is the second country where the opposition of the respondent, the partner or the religion to use contraceptive methods is the main barrier for using them when they are needed.',
        'ARG': '<a href="https://www.clarin.com/sociedad/campana-ley-aborto-comenzo-2005-proyecto-presento-veces_0_BJvdi0nPz.html">Approximately five thousand women marched in February 2018 in front of the Argentine Congress to demand the legalization of abortion. </a>',
        'AUS': '<a href="http://www.abc.net.au/news/health/2017-07-22/natural-methods-of-contraception-on-the-rise-in-australia/8683346">Natural methods of contraception on the rise in Australia, according to an investigation of Monash University. </a>',
        'BEL': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">Belgium have donated 10 million euros to the <i>She Decides</i> proyect, launched by the Dutch government to boost contraception in developing countries. </a>',
        'BOL': '<a href="https://www.efe.com/efe/america/sociedad/la-vergüenza-y-el-estigma-de-pedir-preservativos-en-bolivia//20000013-3265652">Bolivia\'s pharmacies have developed a secret code to ask for condoms and therefore, to avoid stigma about buying them.</a>',
        'COL': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html">After one child policiy, outrage at China\'s offer to remove IUDs.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures">El Salvador is one of six countries where abortion is banned under any circumstances, and women who undergo it could face prison </a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html">Helsinki to offer year’s worth of contraceptive pills to under 25-year-olds.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops">French women opt for alternatives as Pill use drops.</a>',
        'GMB': 'In The Gambia, many women use a traditional method that involves tying a rope, a branch or a piece of paper around the waist with -or without- phrases from the Koran in it.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577">A trial scheme in Germany is helping women on low incomes to avoid sacrificing their contraception.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco">Religion has a major influence in sexual education of Guatemala young people.</a>',
        'ISR': 'In ultra orthodox judaism, contraceptive use is only permitted if the rabbi gives previous permission to the woman.',
        'JPN': 'Japan, even if it is part of the group of countries with high income, has unmet needs for contraception at the level of countries with low income.',
        'PRK': '95% of women who use contraceptive methods in North Korea have chosen to use IUDs. It is the highest percentage of use of this method worldwide.',
        'NLD': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/">Dutch initiative brings in €181m for family planning campaign.</a>',
        'PER': '<a href="https://interactive.quipu-project.com/#/es/quipu/intro">In the 1990s, Alberto Fujimori, former president of Peru, launched a new family planning programme that resulted in the sterilisation of 272,028 women and 22,004 men in only 4 years.</a>',
        'PHL': '<a href="https://www.theguardian.com/global-development/2017/jul/10/how-bitter-herbs-and-botched-abortions-kill-three-women-a-day-in-the-philippines"> How bitter herbs and botched abortions kill three women a day in the Philippines.</a>',
        'POL': '<a href="https://www.amnesty.org/en/latest/news/2017/06/poland-emergency-contraception-restrictions-catastrophic-for-women-and-girls/">Polish Government takes a step back in the access to the "morning-after" pill and it becomes the only European country where women need a prescription for the use of this contraceptive method.</a>',
        'SSD': '<a href="https://www.theguardian.com/global-development/2017/may/25/every-year-i-give-birth-war-driving-contraception-crisis-sudan-nuba-mountains">\'Every year, I give birth\': why war is driving a contraception crisis in Sudan.</a>',
        'ESP': '<a href="http://cadenaser.com/emisora/2017/09/19/radio_madrid/1505842932_131031.html">Madrid is the only regional government that does not finance contraceptive methods with its funds.</a>',
        'TUR': '<a href="http://www.bbc.com/news/world-europe-36413097">Turkey\'s Erdogan warns Muslims against birth control.</a>',
        'UGA': '<a href="https://www.newvision.co.ug/new_vision/news/1458882/uganda-facing-150-million-condom-shortfall">In 2017, Uganda faced a 150 millions male condoms shortfall.</a>',
        'GBR': '<a href=https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform">Irish referendum on abortion reform to be held by end of May 2018</a>',
        'USA': '<a href="https://www.nytimes.com/2018/01/18/us/health-care-office-abortion-contraception.html">Trump gives health workers new religious liberty protections.</a>',
        'VEN': '<a href="http://www.bbc.com/mundo/noticias-america-latina-42635412">The shortage and high price of contraceptives in Venezuela influences the increase in unwanted pregnancies</a>',
        'ZMB': '<a href="https://www.ideo.org/project/diva-centres">In Zambia, a radical new approach to contraception is giving adolescent girls the information and services of contraception while doing the manicure.</a>'
      }
    };

    function ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, methods_dhs_names, reasons_names, reasons_dhs_names) {
      this.onSelectFilter = bind(this.onSelectFilter, this);
      this.onSelectCountry = bind(this.onSelectCountry, this);
      this.sentences = this.sentences[lang];
      this.data = {
        use: data_use,
        unmetneeds: data_unmetneeds,
        reasons: data_reasons
      };
      this.methodsKeys = methods_keys;
      this.methodsNames = methods_names;
      this.methodsDHSNames = methods_dhs_names;
      this.reasonsNames = reasons_names;
      this.reasonsDHSNames = reasons_dhs_names;
      this.$app = $('#contraceptives-app');
      this.$app.find('.select-country').select2().change(this.onSelectCountry).val(user_country.code).trigger('change');
      this.$app.find('.contraceptives-app-filters .btn').click(this.onSelectFilter);
      this.$app.css('opacity', 1);
    }

    ContraceptivesApp.prototype.onSelectCountry = function(e) {
      var countryReasons, countryUnmetneeds, countryUse, country_methods, method, method_value, reason, reason_value, reasons, unmetneeds, use;
      this.country_code = $(e.target).val();
      use = null;
      method = null;
      method_value = null;
      unmetneeds = null;
      reason = null;
      reason_value = null;
      this.$app.find('.contraceptives-app-filters').hide().find('.btn').removeClass('active');
      $('.contraceptives-filter').hide();
      if (this.dhs_countries[this.country_code]) {
        this.$app.find('#contraceptives-app-data-year').html(this.dhs_countries[this.country_code].year);
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/' + this.dhs_countries[this.country_code].name + '_all.csv', (function(_this) {
          return function(error, data) {
            var d;
            d = data[0];
            _this.setAppItemData(_this.$app, 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons, _this.sentences[_this.country_code]);
            return _this.$app.find('.contraceptives-app-filters').show();
          };
        })(this));
      } else {
        this.$app.find('#contraceptives-app-data-year').html('2015-16');
        countryUse = this.data.use.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryUse && countryUse[0]) {
          if (countryUse[0]['Any modern method'] !== '0') {
            use = countryUse[0]['Any modern method'];
          }
          country_methods = this.methodsKeys.map((function(_this) {
            return function(key, i) {
              return {
                'name': _this.methodsNames[i],
                'value': +countryUse[0][key]
              };
            };
          })(this));
          country_methods = country_methods.sort(function(a, b) {
            return b.value - a.value;
          });
          method = country_methods[0].name;
          method_value = country_methods[0].value;
        }
        countryUnmetneeds = this.data.unmetneeds.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryUnmetneeds && countryUnmetneeds[0]) {
          unmetneeds = countryUnmetneeds[0]['survey'] ? countryUnmetneeds[0]['survey'] : countryUnmetneeds[0]['estimated'];
        }
        countryReasons = this.data.reasons.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryReasons && countryReasons[0]) {
          reasons = Object.keys(this.reasonsNames).map((function(_this) {
            return function(reason) {
              return {
                'name': _this.reasonsNames[reason],
                'value': +countryReasons[0][reason]
              };
            };
          })(this));
          reasons = reasons.sort(function(a, b) {
            return b.value - a.value;
          });
          reason = reasons[0].name;
          reason_value = reasons[0].value;
        }
        return this.setAppItemData(this.$app, use, method, method_value, unmetneeds, reason, reason_value, this.sentences[this.country_code]);
      }
    };

    ContraceptivesApp.prototype.onSelectFilter = function(e) {
      var $target;
      e.preventDefault();
      if (this.filter !== $(e.target).attr('href').substring(1)) {
        $('html, body').animate({
          scrollTop: this.$app.find('.contraceptives-app-filters').offset().top - 15
        }, 400);
        this.$app.find('.contraceptives-app-filters .btn').removeClass('active');
        $target = $(e.target).addClass('active');
        this.filter = $target.attr('href').substring(1);
        $('.contraceptives-filter').hide();
        this.filterEl = $('#' + this.filter).show();
        return d3.csv($('body').data('baseurl') + '/data/contraceptives-reasons/' + this.dhs_countries[this.country_code].name + '_' + this.filter_keys[this.filter] + '.csv', (function(_this) {
          return function(error, data) {
            if (data) {
              return data.forEach(function(d) {
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
              });
            }
          };
        })(this));
      }
    };

    ContraceptivesApp.prototype.setAppItemData = function($el, use, method, method_value, unmetneeds, reason, reason_value, sentence) {
      if (use) {
        $el.find('.contraceptives-app-data-use').html(Math.round(+use) + '%');
        $el.find('.contraceptives-app-use').show();
      } else {
        $el.find('.contraceptives-app-use').hide();
      }
      if (method) {
        $el.find('.contraceptives-app-data-main-method').html(method);
        $el.find('.contraceptives-app-data-main-method-value').html(Math.round(+method_value) + '%');
        $el.find('.contraceptives-app-method').show();
      } else {
        $el.find('.contraceptives-app-method').hide();
      }
      if (unmetneeds) {
        $el.find('.contraceptives-app-data-unmetneeds').html(Math.round(+unmetneeds) + '%');
        $el.find('.contraceptives-app-unmetneeds').show();
      } else {
        $el.find('.contraceptives-app-unmetneeds').hide();
      }
      if (reason) {
        $el.find('.contraceptives-app-data-reason').html(reason);
        $el.find('.contraceptives-app-data-reason-value').html(Math.round(+reason_value) + '%');
        $el.find('.contraceptives-app-reason').show();
      } else {
        $el.find('.contraceptives-app-reason').hide();
      }
      if (sentence) {
        return $el.find('.contraceptives-app-sentence').html(sentence).show();
      } else {
        return $el.find('.contraceptives-app-sentence').hide();
      }
    };

    return ContraceptivesApp;

  })();

}).call(this);

(function() {
  (function($) {
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, reasons_dhs_names, reasons_names, scrollamaInitialized, setLocation, userCountry;
    userCountry = {};
    scrollamaInitialized = false;
    lang = $('#lang').data('lang');
    baseurl = 'https://pre.medicamentalia.org/assets';
    if (lang === 'es') {
      d3.formatDefaultLocale({
        "currency": ["$", ""],
        "decimal": ",",
        "thousands": ".",
        "grouping": [3]
      });
    }
    methods_keys = ["Female sterilization", "Male sterilization", "IUD", "Implant", "Injectable", "Pill", "Male condom", "Female condom", "Vaginal barrier methods", "Lactational amenorrhea method (LAM)", "Emergency contraception", "Other modern methods", "Any traditional method"];
    methods_names = {
      'es': ["esterilización femenina", "esterilización masculina", "DIU", "implante", "inyectable", "píldora", "condón masculino", "condón femenino", "métodos de barrera vaginal", "método de la amenorrea de la lactancia (MELA)", "anticonceptivos de emergencia", "otros métodos modernos", "métodos tradicionales"],
      'en': ["female sterilisation", "male sterilisation", "IUD", "implant", "injectable", "pill", "male condom", "female condom", "vaginal barrier methods", "lactational amenorrhea method (LAM)", "emergency contraception", "other modern methods", "traditional methods"]
    };
    methods_dhs_names = {
      'es': {
        '1': "píldora",
        '2': "DIU",
        '3': "inyectable",
        '5': "condón",
        '6': "esterilización femenina",
        '7': "esterilización masculina",
        '8': "abstinencia periódica",
        '9': "marcha atrás",
        '10': "otros",
        '11': "implante",
        '13': "método de la amenorrea de la lactancia (MELA)",
        '17': "métodos tradicionales"
      },
      'en': {
        '1': "pill",
        '2': "IUD",
        '3': "injectable",
        '5': "condom",
        '6': "female sterilisation",
        '7': "male sterilisation",
        '8': "periodic abstinence",
        '9': "withdrawal",
        '10': "other",
        '11': "implant",
        '13': "lactational amenorrhea method (LAM)",
        '17': "traditional methods"
      }
    };

    /*
    methods_icons = 
      "Female sterilization": 'sterilization'
      "Male sterilization": 'sterilization'
      "IUD": 'diu'
      "Implant": null
      "Injectable": 'injectable'
      "Pill": 'pill'
      "Male condom": 'condom'
      "Female condom": null
      "Vaginal barrier methods": null
      "Lactational amenorrhea method (LAM)": null
      "Emergency contraception": null
      "Other modern methods": null
      "Any traditional method": 'traditional'
     */
    reasons_names = {
      'es': {
        "a": "no están casadas",
        "b": "no tienen sexo",
        "c": "tienen sexo infrecuente",
        "d": "menopausia o esterilización",
        "e": "son subfecundas o infecundas",
        "f": "amenorrea postparto",
        "g": "están dando el pecho",
        "h": "fatalista",
        "i": "la mujer se opone",
        "j": "el marido o la pareja se opone",
        "k": "otros se oponen",
        "l": "prohibición religiosa",
        "m": "no conoce los métodos",
        "n": "no conoce ninguna fuente donde adquirirlos",
        "o": "preocupaciones de salud",
        "p": "miedo a los efectos secundarios/preocupaciones de salud",
        "q": "falta de acceso/muy lejos",
        "r": "cuestan demasiado",
        "s": "inconvenientes para su uso",
        "t": "interfiere con los procesos del cuerpo",
        "u": "el método elegido no está disponible",
        "v": "no hay métodos disponibles",
        "w": "(no estándar)",
        "x": "otros",
        "z": "no lo sé"
      },
      'en': {
        "a": "not married",
        "b": "not having sex",
        "c": "infrequent sex",
        "d": "menopausal/hysterectomy",
        "e": "subfecund/infecund",
        "f": "postpartum amenorrheic",
        "g": "breastfeeding",
        "h": "fatalistic",
        "i": "respondent opposed",
        "j": "husband/partner opposed",
        "k": "others opposed",
        "l": "religious prohibition",
        "m": "knows no method",
        "n": "knows no source",
        "o": "health concerns",
        "p": "fear of side effects/health concerns",
        "q": "lack of access/too far",
        "r": "costs too much",
        "s": "inconvenient to use",
        "t": "interferes with body's processes",
        "u": "preferred method not available",
        "v": "no method available",
        "w": "(no estándar)",
        "x": "other",
        "z": "don't know"
      }
    };
    reasons_dhs_names = {
      'es': {
        'v3a08a': 'no están casadas',
        'v3a08b': 'no tienen sexo',
        'v3a08c': 'tienen sexo infrecuente',
        'v3a08d': 'menopausia o esterilización',
        'v3a08e': 'son subfecundas o infecundas',
        'v3a08f': 'amenorrea postparto',
        'v3a08g': 'están dando el pecho',
        'v3a08h': 'fatalista',
        'v3a08i': 'la mujer se opone',
        'v3a08j': 'el marido o la pareja se opone',
        'v3a08k': 'otros se oponen',
        'v3a08l': 'prohibición religiosa',
        'v3a08m': 'no conoce los métodos',
        'v3a08n': 'no conoce ninguna fuente donde adquirirlos',
        'v3a08o': 'preocupaciones de salud',
        'v3a08p': 'miedo a los efectos secundarios',
        'v3a08q': 'falta de acceso/muy lejos',
        'v3a08r': 'cuestan demasiado',
        'v3a08s': 'inconvenientes para su uso',
        'v3a08t': "interfiere con los procesos del cuerpo"
      },
      'en': {
        'v3a08a': 'not married',
        'v3a08b': 'not having sex',
        'v3a08c': 'infrequent sex',
        'v3a08d': 'menopausal/hysterectomy',
        'v3a08e': 'subfecund/infecund',
        'v3a08f': 'postpartum amenorrheic',
        'v3a08g': 'breastfeeding',
        'v3a08h': 'fatalistic',
        'v3a08i': 'respondent opposed',
        'v3a08j': 'husband/partner opposed',
        'v3a08k': 'others opposed',
        'v3a08l': 'religious prohibition',
        'v3a08m': 'knows no method',
        'v3a08n': 'knows no source',
        'v3a08o': 'health concerns',
        'v3a08p': 'fear of side effects',
        'v3a08q': 'lack of access/too far',
        'v3a08r': 'costs too much',
        'v3a08s': 'inconvenient to use',
        'v3a08t': "interferes with the body's processes"
      }
    };
    setLocation = function(location, countries) {
      var user_country;
      if (location) {
        user_country = countries.filter(function(d) {
          return d.code2 === location.country_code;
        });
        if (user_country[0]) {
          userCountry.code = user_country[0].code;
          userCountry.name = user_country[0]['name_' + lang];
        }
      } else {
        location = {};
      }
      if (!location.code) {
        userCountry.code = 'ESP';
        return userCountry.name = lang === 'es' ? 'España' : 'Spain';
      }
    };
    return d3.json('https://freegeoip.net/json/', function(error, location) {
      return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data_use, data_unmetneeds, data_reasons, countries, map) {
        setLocation(location, countries);
        if ($('#contraceptives-app').length) {
          return new ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang]);
        }
      });
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWNlcHRpdmVzLWFwcC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLXN0YXRpYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztnQ0FFWCxXQUFBLEdBQ0U7TUFBQSx5QkFBQSxFQUEyQixXQUEzQjtNQUNBLHlCQUFBLEVBQTJCLEtBRDNCO01BRUEseUJBQUEsRUFBMkIsV0FGM0I7TUFHQSx5QkFBQSxFQUEyQixRQUgzQjs7O2dDQUtGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FERjtNQUdBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FKRjtNQU1BLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FWRjtNQVlBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FiRjtNQWVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FoQkY7TUFrQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsTUFEUjtPQW5CRjtNQXFCQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsVUFBUjtRQUNBLE1BQUEsRUFBUSxNQURSO09BdEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0F6QkY7TUEyQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsU0FEUjtPQTVCRjtNQThCQSxLQUFBLEVBQ0U7UUFBQSxN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R0FBUSwwQkFMMUIsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLGVBQWxCLEVBQW1DLFlBQW5DLEVBQWlELFNBQWpELEVBQTRELEdBQTVEO1FBQ0wsV0FBQSxDQUFZLFFBQVosRUFBc0IsU0FBdEI7UUFDQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2lCQUNNLElBQUEsaUJBQUEsQ0FBa0IsSUFBbEIsRUFBd0IsUUFBeEIsRUFBa0MsZUFBbEMsRUFBbUQsWUFBbkQsRUFBaUUsV0FBakUsRUFBOEUsWUFBOUUsRUFBNEYsYUFBYyxDQUFBLElBQUEsQ0FBMUcsRUFBaUgsaUJBQWtCLENBQUEsSUFBQSxDQUFuSSxFQUEwSSxhQUFjLENBQUEsSUFBQSxDQUF4SixFQUErSixpQkFBa0IsQ0FBQSxJQUFBLENBQWpMLEVBRE47O01BRkssQ0FOVDtJQUZxQyxDQUF2QztFQXhPRCxDQUFELENBQUEsQ0FxUEUsTUFyUEY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy1zdGF0aWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNBcHBcblxuICBmaWx0ZXJfa2V5czogXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0wJzogJ3Jlc2lkZW5jZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTEnOiAnYWdlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMic6ICdlZHVjYXRpb24nXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0zJzogJ3dlYWx0aCdcblxuICBkaHNfY291bnRyaWVzOlxuICAgICdBRkcnOlxuICAgICAgJ25hbWUnOiAnQUZJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE3J1xuICAgICdBTEInOlxuICAgICAgJ25hbWUnOiAnQUxJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdBUk0nOlxuICAgICAgJ25hbWUnOiAnQU1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdBR08nOlxuICAgICAgJ25hbWUnOiAnQU9JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdBWkUnOlxuICAgICAgJ25hbWUnOiAnQVpJUjUyRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCR0QnOlxuICAgICAgJ25hbWUnOiAnQkRJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdCRU4nOlxuICAgICAgJ25hbWUnOiAnQkpJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCT0wnOlxuICAgICAgJ25hbWUnOiAnQk9JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdCREknOlxuICAgICAgJ25hbWUnOiAnQlVJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdDT0QnOlxuICAgICAgJ25hbWUnOiAnQ0RJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdDT0cnOlxuICAgICAgJ25hbWUnOiAnQ0dJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDSVYnOlxuICAgICAgJ25hbWUnOiAnQ0lJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDTVInOlxuICAgICAgJ25hbWUnOiAnQ01JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdDT0wnOlxuICAgICAgJ25hbWUnOiAnQ09JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdET00nOlxuICAgICAgJ25hbWUnOiAnRFJJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdFR1knOlxuICAgICAgJ25hbWUnOiAnRUdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdFVEgnOlxuICAgICAgJ25hbWUnOiAnRVRJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdHSEEnOlxuICAgICAgJ25hbWUnOiAnR0hJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdHTUInOlxuICAgICAgJ25hbWUnOiAnR01JUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdHSU4nOlxuICAgICAgJ25hbWUnOiAnR05JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdHVE0nOlxuICAgICAgJ25hbWUnOiAnR1VJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdHVVknOlxuICAgICAgJ25hbWUnOiAnR1lJUjVJRFQnXG4gICAgICAneWVhcic6ICcyMDA5J1xuICAgICdITkQnOlxuICAgICAgJ25hbWUnOiAnSE5JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdIVEknOlxuICAgICAgJ25hbWUnOiAnSFRJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdJTkQnOlxuICAgICAgJ25hbWUnOiAnSUFJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdJRE4nOlxuICAgICAgJ25hbWUnOiAnSURJUjYzRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdKT1InOlxuICAgICAgJ25hbWUnOiAnSk9JUjZDRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdLRU4nOlxuICAgICAgJ25hbWUnOiAnS0VJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdLSE0nOlxuICAgICAgJ25hbWUnOiAnS0hJUjczRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdMQlInOlxuICAgICAgJ25hbWUnOiAnTEJJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdMU08nOlxuICAgICAgJ25hbWUnOiAnTFNJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdNQVInOlxuICAgICAgJ25hbWUnOiAnTUFJUjQzRFQnXG4gICAgICAneWVhcic6ICcyMDAzLTA0J1xuICAgICdNREcnOlxuICAgICAgJ25hbWUnOiAnTURJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdNTEknOlxuICAgICAgJ25hbWUnOiAnTUxJUjUzRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdNTVInOlxuICAgICAgJ25hbWUnOiAnTU1JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdNV0knOlxuICAgICAgJ25hbWUnOiAnTVdJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdNT1onOlxuICAgICAgJ25hbWUnOiAnTVpJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdOR0EnOlxuICAgICAgJ25hbWUnOiAnTkdJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdORVInOlxuICAgICAgJ25hbWUnOiAnTklJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdOQU0nOlxuICAgICAgJ25hbWUnOiAnTk1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdOUEwnOlxuICAgICAgJ25hbWUnOiAnTlBJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdQRVInOlxuICAgICAgJ25hbWUnOiAnUEVJUjZJRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdQSEwnOlxuICAgICAgJ25hbWUnOiAnUEhJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdQQUsnOlxuICAgICAgJ25hbWUnOiAnUEtJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdSV0EnOlxuICAgICAgJ25hbWUnOiAnUldJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdTTEUnOlxuICAgICAgJ25hbWUnOiAnU0xJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdTRU4nOlxuICAgICAgJ25hbWUnOiAnU05JUjZERFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdTVFAnOlxuICAgICAgJ25hbWUnOiAnU1RJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdTV1onOlxuICAgICAgJ25hbWUnOiAnU1pJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdUQ0QnOlxuICAgICAgJ25hbWUnOiAnVERJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdUR08nOlxuICAgICAgJ25hbWUnOiAnVEdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdUSksnOlxuICAgICAgJ25hbWUnOiAnVEpJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdUTFMnOlxuICAgICAgJ25hbWUnOiAnVExJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDA5LTEwJ1xuICAgICdUWkEnOlxuICAgICAgJ25hbWUnOiAnVFpJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdVR0EnOlxuICAgICAgJ25hbWUnOiAnVUdJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdaTUInOlxuICAgICAgJ25hbWUnOiAnWk1JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA3J1xuICAgICdaV0UnOlxuICAgICAgJ25hbWUnOiAnWldJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuXG4gIHNlbnRlbmNlczogXG4gICAgJ2VzJzpcbiAgICAgICdBTEInOiAnTGEgbWFyY2hhIGF0csOhcyBlcyBlbCBwcmltZXIgbcOpdG9kbyBhbnRpY29uY2VwdGl2byBkZSBBbGJhbmlhLiBBZGVtw6FzLCBzZSB0cmF0YSBkZWwgc2VndW5kbyBwYcOtcyBkb25kZSBleGlzdGUgbWF5b3Igb3Bvc2ljacOzbiBkZSBsYSBwcm9waWEgbXVqZXIsIGxhIHBhcmVqYSBvIGxhIHJlbGlnacOzbiBhIHRvbWFyIGFudGljb25jZXB0aXZvcy4nXG4gICAgICAnQVJHJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jbGFyaW4uY29tL3NvY2llZGFkL2NhbXBhbmEtbGV5LWFib3J0by1jb21lbnpvLTIwMDUtcHJveWVjdG8tcHJlc2VudG8tdmVjZXNfMF9CSnZkaTBuUHouaHRtbFwiPlVuYXMgY2luY28gbWlsIG11amVyZXMgbWFyY2hhcm9uIGVuIGZlYnJlcm8gZGUgMjAxOCBmcmVudGUgYWwgQ29uZ3Jlc28gYXJnZW50aW5vIHBhcmEgcGVkaXIgbGEgbGVnYWxpemFjacOzbiBkZWwgYWJvcnRvLjwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiPk11Y2hvcyBhdXN0cmFsaWFub3MgZXN0w6FuIHZvbHZpZW5kbyBhIHV0aWxpemFyIG3DqXRvZG9zIHRyYWRpY2lvbmFsZXMgZGUgYW50aWNvbmNlcGNpw7NuLCBzZWfDum4gdW4gZXN0dWRpbyBkZSBNb25hc2ggVW5pdmVyc2l0eS48L2E+J1xuICAgICAgJ0JFTCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCI+QsOpbGdpY2EgZG9uw7MgMTAgbWlsbG9uZXMgZGUgZXVyb3MgcGFyYSBsYSBjYW1wYcOxYSA8aT5TaGUgRGVjaWRlczwvaT4sIGxhbnphZGEgcG9yIGVsIEdvYmllcm5vIGhvbGFuZMOpcyBwYXJhIGNvbnRyYXJyZXN0YXIgbGEgcmV0aXJhZGEgZGUgZm9uZG9zIHBhcmEgcGxhbmlmaWNhY2nDs24gZmFtaWxpYXIgZGUgVHJ1bXAuPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCI+RmFybWFjaWFzIGRlIEJvbGl2aWEgaW1wbGVtZW50YXJvbiBjw7NkaWdvcyBzZWNyZXRvcyBwYXJhIHBlZGlyIHByZXNlcnZhdGl2b3MgeSBldml0YXIgZWwgZXN0aWdtYSBkZSBjb21wcmFyIGVzdG9zIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICAgJ0NPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxNy8wMS8wNy93b3JsZC9hc2lhL2FmdGVyLW9uZS1jaGlsZC1wb2xpY3ktb3V0cmFnZS1hdC1jaGluYXMtb2ZmZXItdG8tcmVtb3ZlLWl1ZHMuaHRtbFwiPkVsIEdvYmllcm5vIGNoaW5vIG9mcmVjZSBsYSByZXRpcmFkYSBncmF0dWl0YSBkZSBESVVzIGRlc3B1w6lzIGRlIGxhIHBvbMOtdGljYSBkZWwgaGlqbyDDum5pY28uPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCI+RWwgU2FsdmFkb3IgZXMgZWwgw7puaWNvIHBhw61zIGRlbCBtdW5kbyBkb25kZSBhYm9ydGFyIGVzdMOhIHBlbmFkbyBjb24gY8OhcmNlbC48L2E+J1xuICAgICAgJ0ZJTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5oZWxzaW5raXRpbWVzLmZpL2ZpbmxhbmQvZmlubGFuZC9uZXdzL2RvbWVzdGljLzE1MjcxLWhlbHNpbmtpLXRvLW9mZmVyLXllYXItcy13b3J0aC1vZi1jb250cmFjZXB0aXZlLXBpbGxzLXRvLXVuZGVyLTI1LXllYXItb2xkcy5odG1sXCI+RWwgYXl1bnRhbWllbnRvIGRlIEhlbHNpbmtpIHByb3BvcmNpb25hIGFudGljb25jZXB0aXZvcyBkZSBtYW5lcmEgZ3JhdHVpdGEgYSBsb3MgasOzdmVuZXMgbWVub3JlcyBkZSAyNSBhw7Fvcy48L2E+J1xuICAgICAgJ0ZSQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY29ubmV4aW9uZnJhbmNlLmNvbS9GcmVuY2gtbmV3cy9GcmVuY2gtd29tZW4tb3B0LWZvci1hbHRlcm5hdGl2ZXMtYXMtUGlsbC11c2UtZHJvcHNcIj5FbCB1c28gZGUgbGFzIHBhc3RpbGxhcyBhbnRpY29uY2VwdGl2YXMgc2UgaGEgcmVkdWNpZG8gZW4gRnJhbmNpYSBkZXNkZSAyMDEwLjwvYT4nXG4gICAgICAnR01CJzogJ0VuIEdhbWJpYSwgbXVjaGFzIG11amVyZXMgdXRpbGl6YW4gdW4gbcOpdG9kbyB0cmFkaWNpb25hbCBxdWUgY29uc2lzdGUgZW4gYXRhciBhIGxhIGNpbnR1cmEgdW5hIGN1ZXJkYSwgdW5hIHJhbWEsIG8gdW4gcGFwZWxpdG8gY29uIG8gc2luIGZyYXNlcyBkZWwgQ29yw6FuLidcbiAgICAgICdERVUnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHcuY29tL2VuL2ZyZWUtcHJlc2NyaWJlZC1jb250cmFjZXB0aW9uLWZvci1sb3ctZWFybmVycy9hLTM4MTYxNTc3XCI+VW4gcHJveWVjdG8gYWxlbcOhbiBmYWNpbGl0YSBhbnRpY29uY2VwdGl2b3MgZGUgZm9ybWEgZ3JhdHVpdGEgYSBtdWplcmVzIGRlIG3DoXMgZGUgMjAgYcOxb3MgY29uIGluZ3Jlc29zIGJham9zLjwvYT4nXG4gICAgICAnR1RNJzogJzxhIGhyZWY9XCJodHRwOi8vYnVmZi5seS8ydGFZd2NvXCI+TGEgcmVsaWdpw7NuIGluZmx1eWUgZW4gbGEgZWR1Y2FjacOzbiBzZXh1YWwgZGUgbG9zIGrDs3ZlbmVzIGd1YXRlbWFsdGVjb3MuPC9hPidcbiAgICAgICdJU1InOiAnRW4gbG9zIHNlY3RvcmVzIGp1ZMOtb3MgbcOhcyBvcnRvZG94b3MsIHNvbG8gcHVlZGVuIHVzYXJzZSBsb3MgYW50aWNvbmNlcHRpdm9zIHNpIGVsIHJhYmlubyBkYSBzdSBwZXJtaXNvIGEgbGEgbXVqZXIuJ1xuICAgICAgJ0pQTic6ICdKYXDDs24sIGF1bnF1ZSBzZSBlbmN1ZW50cmEgZW4gZWwgZ3J1cG8gZGUgcGHDrXNlcyBjb24gcmVudGEgYWx0YSwgZXMgbGEgZXhjZXBjacOzbjogbGFzIG5lY2VzaWRhZGVzIG5vIGN1YmllcnRhcyBjb24gYW50aWNvbmNlcHRpdm9zIGVzdMOhIGFsIG5pdmVsIGRlIHBhw61zZXMgY29uIHJlbnRhcyBiYWphcy4nXG4gICAgICAnUFJLJzogJ0VsIDk1JSBkZSBtdWplcmVzIHF1ZSB1dGlsaXphbiBhbnRpY29uY2VwdGl2b3MgZW4gQ29yZWEgZGVsIE5vcnRlIGhhbiBlbGVnaWRvIGVsIERJVS4gU2UgdHJhdGEgZGVsIG1heW9yIHBvcmNlbnRhamUgZGUgdXNvIGEgbml2ZWwgbXVuZGlhbC4nXG4gICAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5FbCBnb2JpZXJubyBob2xhbmTDqXMgbGFuemEgZWwgcHJveWVjdG8gPGk+U2hlIERlY2lkZXM8L2k+IHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCI+RW4gbGEgw6lwb2NhIGRlIGxvcyA5MCwgZHVyYW50ZSBlbCBnb2JpZXJubyBkZSBGdWppbW9yaSwgbcOhcyBkZSAyNTAuMDAwIG11amVyZXMgZnVlcm9uIGVzdGVyaWxpemFkYXMgc2luIHN1IGNvbnNlbnRpbWllbnRvLjwvYT4nXG4gICAgICAnUEhMJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvanVsLzEwL2hvdy1iaXR0ZXItaGVyYnMtYW5kLWJvdGNoZWQtYWJvcnRpb25zLWtpbGwtdGhyZWUtd29tZW4tYS1kYXktaW4tdGhlLXBoaWxpcHBpbmVzXCI+IEVuIHVuIHBhw61zIGRvbmRlIGVsIGFib3J0byBkZWwgZXN0w6EgcHJvaGliaWRvLCB0cmVzIG11amVyZXMgbXVlcmVuIGFsIGTDrWEgcG9yIGNvbXBsaWNhY2lvbmVzIGRlcml2YWRhcyBkZSBpbnRlcnZlbmNpb25lcyBpbGVnYWxlcy48L2E+J1xuICAgICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiPkVsIEdvYmllcm5vIHBvbGFjbyBkYSB1biBwYXNvIGF0csOhcyB5IHNlIGNvbnZpZXJ0ZSBlbiBlbCDDum5pY28gcGHDrXMgZGUgbGEgVW5pw7NuIEV1cm9wZWEgZG9uZGUgbGEgcGFzdGlsbGEgZGVsIGTDrWEgZGVzcHXDqXMgZXN0w6Egc3VqZXRhIGEgcHJlc2NyaXBjacOzbi48L2E+J1xuICAgICAgJ1NTRCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L21heS8yNS9ldmVyeS15ZWFyLWktZ2l2ZS1iaXJ0aC13YXItZHJpdmluZy1jb250cmFjZXB0aW9uLWNyaXNpcy1zdWRhbi1udWJhLW1vdW50YWluc1wiPkxhIGd1ZXJyYSBlbiBTdWTDoW4gZXN0w6EgY3JlYW5kbyB1bmEgY3Jpc2lzIGVuIGVsIGFjY2VzbyBhIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICAgJ0VTUCc6ICc8YSBocmVmPVwiaHR0cDovL2NhZGVuYXNlci5jb20vZW1pc29yYS8yMDE3LzA5LzE5L3JhZGlvX21hZHJpZC8xNTA1ODQyOTMyXzEzMTAzMS5odG1sXCI+TWFkcmlkIGVzIGxhIMO6bmljYSBjb211bmlkYWQgcXVlIG5vIGZpbmFuY2lhIGFudGljb25jZXB0aXZvcyBjb24gc3VzIGZvbmRvcy48L2E+J1xuICAgICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCI+RXJkb2dhbiBkZWNsYXJhIHF1ZSBsYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBubyBlcyBwYXJhIGxvcyBtdXN1bG1hbmVzLjwvYT4nXG4gICAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCI+RW4gMjAxNywgZWwgTWluaXN0ZXJpbyBkZSBTYWx1ZCBkZSBVZ2FuZGEgZGVjbGFyYWJhIHVuIGRlc2FiYXN0ZWNpbWllbnRvIGRlIDE1MCBtaWxsb25lcyBkZSBwcmVzZXJ2YXRpdm9zIG1hc2N1bGlub3MuPC9hPidcbiAgICAgICdHQlInOiAnPGEgaHJlZj1odHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vd29ybGQvMjAxOC9qYW4vMjkvaXJlbGFuZC10by1ncmVlbmxpZ2h0LXJlZmVyZW5kdW0tb24tYWJvcnRpb24tbGF3LXJlZm9ybVwiPkVuIElybGFuZGEgZXMgaWxlZ2FsIGFib3J0YXIgYSBubyBzZXIgcXVlIGhheWEgdW4gcmllc2dvIHJlYWwgZGUgc2FsdWQgcGFyYSBsYSBtYWRyZS48L2E+J1xuICAgICAgJ1VTQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxOC8wMS8xOC91cy9oZWFsdGgtY2FyZS1vZmZpY2UtYWJvcnRpb24tY29udHJhY2VwdGlvbi5odG1sXCI+VHJ1bXAgZGEgYSBsb3MgbcOpZGljb3MgbGliZXJ0YWQgcGFyYSBuZWdhcnNlIGEgcmVhbGl6YXIgcHJvY2VkaW1pZW50b3MgZW4gY29udHJhIGRlIHN1cyBjcmVlbmNpYXMgcmVsaWdpb3NhcywgY29tbyBlbCBhYm9ydG8uPC9hPidcbiAgICAgICdWRU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYmJjLmNvbS9tdW5kby9ub3RpY2lhcy1hbWVyaWNhLWxhdGluYS00MjYzNTQxMlwiPkxhIGVzY2FzZXogeSBlbCBwcmVjaW8gZWxldmFkbyBkZSBsb3MgYW50aWNvbmNlcHRpdm9zIGVuIFZlbmV6dWVsYSBpbmZsdXllIGVuIGVsIGF1bWVudG8gZGUgZW1iYXJhem9zIG5vIGRlc2VhZG9zLjwvYT4nXG4gICAgICAnWk1CJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5pZGVvLm9yZy9wcm9qZWN0L2RpdmEtY2VudHJlc1wiPlVuIHByb3llY3RvIGVuIFphbWJpYSAgdW5lIGxhIG1hbmljdXJhIHkgbG9zIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICdlbic6XG4gICAgICAnQUxCJzogJ1dpdGhkcmF3biBpcyB0aGUgbW9zdCB1c2VkIGNvbnRyYWNlcHRpdmUgbWV0aG9kIGJ5IEFsYmFuaWFuIHdvbWVuLiBGdXJ0aGVybW9yZSwgaXQgaXMgdGhlIHNlY29uZCBjb3VudHJ5IHdoZXJlIHRoZSBvcHBvc2l0aW9uIG9mIHRoZSByZXNwb25kZW50LCB0aGUgcGFydG5lciBvciB0aGUgcmVsaWdpb24gdG8gdXNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyBpcyB0aGUgbWFpbiBiYXJyaWVyIGZvciB1c2luZyB0aGVtIHdoZW4gdGhleSBhcmUgbmVlZGVkLidcbiAgICAgICdBUkcnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNsYXJpbi5jb20vc29jaWVkYWQvY2FtcGFuYS1sZXktYWJvcnRvLWNvbWVuem8tMjAwNS1wcm95ZWN0by1wcmVzZW50by12ZWNlc18wX0JKdmRpMG5Qei5odG1sXCI+QXBwcm94aW1hdGVseSBmaXZlIHRob3VzYW5kIHdvbWVuIG1hcmNoZWQgaW4gRmVicnVhcnkgMjAxOCBpbiBmcm9udCBvZiB0aGUgQXJnZW50aW5lIENvbmdyZXNzIHRvIGRlbWFuZCB0aGUgbGVnYWxpemF0aW9uIG9mIGFib3J0aW9uLiA8L2E+J1xuICAgICAgJ0FVUyc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5hYmMubmV0LmF1L25ld3MvaGVhbHRoLzIwMTctMDctMjIvbmF0dXJhbC1tZXRob2RzLW9mLWNvbnRyYWNlcHRpb24tb24tdGhlLXJpc2UtaW4tYXVzdHJhbGlhLzg2ODMzNDZcIj5OYXR1cmFsIG1ldGhvZHMgb2YgY29udHJhY2VwdGlvbiBvbiB0aGUgcmlzZSBpbiBBdXN0cmFsaWEsIGFjY29yZGluZyB0byBhbiBpbnZlc3RpZ2F0aW9uIG9mIE1vbmFzaCBVbml2ZXJzaXR5LiA8L2E+J1xuICAgICAgJ0JFTCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCI+QmVsZ2l1bSBoYXZlIGRvbmF0ZWQgMTAgbWlsbGlvbiBldXJvcyB0byB0aGUgPGk+U2hlIERlY2lkZXM8L2k+IHByb3llY3QsIGxhdW5jaGVkIGJ5IHRoZSBEdXRjaCBnb3Zlcm5tZW50IHRvIGJvb3N0IGNvbnRyYWNlcHRpb24gaW4gZGV2ZWxvcGluZyBjb3VudHJpZXMuIDwvYT4nXG4gICAgICAnQk9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5lZmUuY29tL2VmZS9hbWVyaWNhL3NvY2llZGFkL2xhLXZlcmfDvGVuemEteS1lbC1lc3RpZ21hLWRlLXBlZGlyLXByZXNlcnZhdGl2b3MtZW4tYm9saXZpYS8vMjAwMDAwMTMtMzI2NTY1MlwiPkJvbGl2aWFcXCdzIHBoYXJtYWNpZXMgaGF2ZSBkZXZlbG9wZWQgYSBzZWNyZXQgY29kZSB0byBhc2sgZm9yIGNvbmRvbXMgYW5kIHRoZXJlZm9yZSwgdG8gYXZvaWQgc3RpZ21hIGFib3V0IGJ1eWluZyB0aGVtLjwvYT4nXG4gICAgICAnQ09MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCI+QWZ0ZXIgb25lIGNoaWxkIHBvbGljaXksIG91dHJhZ2UgYXQgQ2hpbmFcXCdzIG9mZmVyIHRvIHJlbW92ZSBJVURzLjwvYT4nXG4gICAgICAnU0xWJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LXByb2Zlc3Npb25hbHMtbmV0d29yay9nYWxsZXJ5LzIwMTcvbWF5LzI2L3JlcHJvZHVjdGl2ZS1yaWdodHMtemlrYS13b21lbi1lbC1zYWx2YWRvci1pbi1waWN0dXJlc1wiPkVsIFNhbHZhZG9yIGlzIG9uZSBvZiBzaXggY291bnRyaWVzIHdoZXJlIGFib3J0aW9uIGlzIGJhbm5lZCB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcywgYW5kIHdvbWVuIHdobyB1bmRlcmdvIGl0IGNvdWxkIGZhY2UgcHJpc29uIDwvYT4nXG4gICAgICAnRklOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmhlbHNpbmtpdGltZXMuZmkvZmlubGFuZC9maW5sYW5kL25ld3MvZG9tZXN0aWMvMTUyNzEtaGVsc2lua2ktdG8tb2ZmZXIteWVhci1zLXdvcnRoLW9mLWNvbnRyYWNlcHRpdmUtcGlsbHMtdG8tdW5kZXItMjUteWVhci1vbGRzLmh0bWxcIj5IZWxzaW5raSB0byBvZmZlciB5ZWFy4oCZcyB3b3J0aCBvZiBjb250cmFjZXB0aXZlIHBpbGxzIHRvIHVuZGVyIDI1LXllYXItb2xkcy48L2E+J1xuICAgICAgJ0ZSQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY29ubmV4aW9uZnJhbmNlLmNvbS9GcmVuY2gtbmV3cy9GcmVuY2gtd29tZW4tb3B0LWZvci1hbHRlcm5hdGl2ZXMtYXMtUGlsbC11c2UtZHJvcHNcIj5GcmVuY2ggd29tZW4gb3B0IGZvciBhbHRlcm5hdGl2ZXMgYXMgUGlsbCB1c2UgZHJvcHMuPC9hPidcbiAgICAgICdHTUInOiAnSW4gVGhlIEdhbWJpYSwgbWFueSB3b21lbiB1c2UgYSB0cmFkaXRpb25hbCBtZXRob2QgdGhhdCBpbnZvbHZlcyB0eWluZyBhIHJvcGUsIGEgYnJhbmNoIG9yIGEgcGllY2Ugb2YgcGFwZXIgYXJvdW5kIHRoZSB3YWlzdCB3aXRoIC1vciB3aXRob3V0LSBwaHJhc2VzIGZyb20gdGhlIEtvcmFuIGluIGl0LidcbiAgICAgICdERVUnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHcuY29tL2VuL2ZyZWUtcHJlc2NyaWJlZC1jb250cmFjZXB0aW9uLWZvci1sb3ctZWFybmVycy9hLTM4MTYxNTc3XCI+QSB0cmlhbCBzY2hlbWUgaW4gR2VybWFueSBpcyBoZWxwaW5nIHdvbWVuIG9uIGxvdyBpbmNvbWVzIHRvIGF2b2lkIHNhY3JpZmljaW5nIHRoZWlyIGNvbnRyYWNlcHRpb24uPC9hPidcbiAgICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIj5SZWxpZ2lvbiBoYXMgYSBtYWpvciBpbmZsdWVuY2UgaW4gc2V4dWFsIGVkdWNhdGlvbiBvZiBHdWF0ZW1hbGEgeW91bmcgcGVvcGxlLjwvYT4nXG4gICAgICAnSVNSJzogJ0luIHVsdHJhIG9ydGhvZG94IGp1ZGFpc20sIGNvbnRyYWNlcHRpdmUgdXNlIGlzIG9ubHkgcGVybWl0dGVkIGlmIHRoZSByYWJiaSBnaXZlcyBwcmV2aW91cyBwZXJtaXNzaW9uIHRvIHRoZSB3b21hbi4nXG4gICAgICAnSlBOJzogJ0phcGFuLCBldmVuIGlmIGl0IGlzIHBhcnQgb2YgdGhlIGdyb3VwIG9mIGNvdW50cmllcyB3aXRoIGhpZ2ggaW5jb21lLCBoYXMgdW5tZXQgbmVlZHMgZm9yIGNvbnRyYWNlcHRpb24gYXQgdGhlIGxldmVsIG9mIGNvdW50cmllcyB3aXRoIGxvdyBpbmNvbWUuJ1xuICAgICAgJ1BSSyc6ICc5NSUgb2Ygd29tZW4gd2hvIHVzZSBjb250cmFjZXB0aXZlIG1ldGhvZHMgaW4gTm9ydGggS29yZWEgaGF2ZSBjaG9zZW4gdG8gdXNlIElVRHMuIEl0IGlzIHRoZSBoaWdoZXN0IHBlcmNlbnRhZ2Ugb2YgdXNlIG9mIHRoaXMgbWV0aG9kIHdvcmxkd2lkZS4nXG4gICAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5EdXRjaCBpbml0aWF0aXZlIGJyaW5ncyBpbiDigqwxODFtIGZvciBmYW1pbHkgcGxhbm5pbmcgY2FtcGFpZ24uPC9hPidcbiAgICAgICdQRVInOiAnPGEgaHJlZj1cImh0dHBzOi8vaW50ZXJhY3RpdmUucXVpcHUtcHJvamVjdC5jb20vIy9lcy9xdWlwdS9pbnRyb1wiPkluIHRoZSAxOTkwcywgQWxiZXJ0byBGdWppbW9yaSwgZm9ybWVyIHByZXNpZGVudCBvZiBQZXJ1LCBsYXVuY2hlZCBhIG5ldyBmYW1pbHkgcGxhbm5pbmcgcHJvZ3JhbW1lIHRoYXQgcmVzdWx0ZWQgaW4gdGhlIHN0ZXJpbGlzYXRpb24gb2YgMjcyLDAyOCB3b21lbiBhbmQgMjIsMDA0IG1lbiBpbiBvbmx5IDQgeWVhcnMuPC9hPidcbiAgICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIj4gSG93IGJpdHRlciBoZXJicyBhbmQgYm90Y2hlZCBhYm9ydGlvbnMga2lsbCB0aHJlZSB3b21lbiBhIGRheSBpbiB0aGUgUGhpbGlwcGluZXMuPC9hPidcbiAgICAgICdQT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmFtbmVzdHkub3JnL2VuL2xhdGVzdC9uZXdzLzIwMTcvMDYvcG9sYW5kLWVtZXJnZW5jeS1jb250cmFjZXB0aW9uLXJlc3RyaWN0aW9ucy1jYXRhc3Ryb3BoaWMtZm9yLXdvbWVuLWFuZC1naXJscy9cIj5Qb2xpc2ggR292ZXJubWVudCB0YWtlcyBhIHN0ZXAgYmFjayBpbiB0aGUgYWNjZXNzIHRvIHRoZSBcIm1vcm5pbmctYWZ0ZXJcIiBwaWxsIGFuZCBpdCBiZWNvbWVzIHRoZSBvbmx5IEV1cm9wZWFuIGNvdW50cnkgd2hlcmUgd29tZW4gbmVlZCBhIHByZXNjcmlwdGlvbiBmb3IgdGhlIHVzZSBvZiB0aGlzIGNvbnRyYWNlcHRpdmUgbWV0aG9kLjwvYT4nXG4gICAgICAnU1NEJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvbWF5LzI1L2V2ZXJ5LXllYXItaS1naXZlLWJpcnRoLXdhci1kcml2aW5nLWNvbnRyYWNlcHRpb24tY3Jpc2lzLXN1ZGFuLW51YmEtbW91bnRhaW5zXCI+XFwnRXZlcnkgeWVhciwgSSBnaXZlIGJpcnRoXFwnOiB3aHkgd2FyIGlzIGRyaXZpbmcgYSBjb250cmFjZXB0aW9uIGNyaXNpcyBpbiBTdWRhbi48L2E+J1xuICAgICAgJ0VTUCc6ICc8YSBocmVmPVwiaHR0cDovL2NhZGVuYXNlci5jb20vZW1pc29yYS8yMDE3LzA5LzE5L3JhZGlvX21hZHJpZC8xNTA1ODQyOTMyXzEzMTAzMS5odG1sXCI+TWFkcmlkIGlzIHRoZSBvbmx5IHJlZ2lvbmFsIGdvdmVybm1lbnQgdGhhdCBkb2VzIG5vdCBmaW5hbmNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyB3aXRoIGl0cyBmdW5kcy48L2E+J1xuICAgICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCI+VHVya2V5XFwncyBFcmRvZ2FuIHdhcm5zIE11c2xpbXMgYWdhaW5zdCBiaXJ0aCBjb250cm9sLjwvYT4nXG4gICAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCI+SW4gMjAxNywgVWdhbmRhIGZhY2VkIGEgMTUwIG1pbGxpb25zIG1hbGUgY29uZG9tcyBzaG9ydGZhbGwuPC9hPidcbiAgICAgICdHQlInOiAnPGEgaHJlZj1odHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vd29ybGQvMjAxOC9qYW4vMjkvaXJlbGFuZC10by1ncmVlbmxpZ2h0LXJlZmVyZW5kdW0tb24tYWJvcnRpb24tbGF3LXJlZm9ybVwiPklyaXNoIHJlZmVyZW5kdW0gb24gYWJvcnRpb24gcmVmb3JtIHRvIGJlIGhlbGQgYnkgZW5kIG9mIE1heSAyMDE4PC9hPidcbiAgICAgICdVU0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTgvMDEvMTgvdXMvaGVhbHRoLWNhcmUtb2ZmaWNlLWFib3J0aW9uLWNvbnRyYWNlcHRpb24uaHRtbFwiPlRydW1wIGdpdmVzIGhlYWx0aCB3b3JrZXJzIG5ldyByZWxpZ2lvdXMgbGliZXJ0eSBwcm90ZWN0aW9ucy48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCI+VGhlIHNob3J0YWdlIGFuZCBoaWdoIHByaWNlIG9mIGNvbnRyYWNlcHRpdmVzIGluIFZlbmV6dWVsYSBpbmZsdWVuY2VzIHRoZSBpbmNyZWFzZSBpbiB1bndhbnRlZCBwcmVnbmFuY2llczwvYT4nXG4gICAgICAnWk1CJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5pZGVvLm9yZy9wcm9qZWN0L2RpdmEtY2VudHJlc1wiPkluIFphbWJpYSwgYSByYWRpY2FsIG5ldyBhcHByb2FjaCB0byBjb250cmFjZXB0aW9uIGlzIGdpdmluZyBhZG9sZXNjZW50IGdpcmxzIHRoZSBpbmZvcm1hdGlvbiBhbmQgc2VydmljZXMgb2YgY29udHJhY2VwdGlvbiB3aGlsZSBkb2luZyB0aGUgbWFuaWN1cmUuPC9hPidcblxuXG4gIGNvbnN0cnVjdG9yOiAobGFuZywgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyX2NvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lcywgbWV0aG9kc19kaHNfbmFtZXMsIHJlYXNvbnNfbmFtZXMsIHJlYXNvbnNfZGhzX25hbWVzKSAtPlxuXG4gICAgQHNlbnRlbmNlcyA9IEBzZW50ZW5jZXNbbGFuZ11cblxuICAgIEBkYXRhID0gXG4gICAgICB1c2U6ICAgICAgICBkYXRhX3VzZVxuICAgICAgdW5tZXRuZWVkczogZGF0YV91bm1ldG5lZWRzXG4gICAgICByZWFzb25zOiAgICBkYXRhX3JlYXNvbnNcblxuICAgIEBtZXRob2RzS2V5cyAgICAgID0gbWV0aG9kc19rZXlzXG4gICAgQG1ldGhvZHNOYW1lcyAgICAgPSBtZXRob2RzX25hbWVzXG4gICAgQG1ldGhvZHNESFNOYW1lcyAgPSBtZXRob2RzX2Roc19uYW1lc1xuICAgIEByZWFzb25zTmFtZXMgICAgID0gcmVhc29uc19uYW1lc1xuICAgIEByZWFzb25zREhTTmFtZXMgID0gcmVhc29uc19kaHNfbmFtZXNcblxuICAgIEAkYXBwID0gJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpXG5cbiAgICBAJGFwcC5maW5kKCcuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLnNlbGVjdDIoKVxuICAgICAgLmNoYW5nZSBAb25TZWxlY3RDb3VudHJ5XG4gICAgICAudmFsIHVzZXJfY291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzIC5idG4nKS5jbGljayBAb25TZWxlY3RGaWx0ZXJcblxuICAgIEAkYXBwLmNzcygnb3BhY2l0eScsMSlcblxuXG4gIG9uU2VsZWN0Q291bnRyeTogKGUpID0+XG4gICAgQGNvdW50cnlfY29kZSA9ICQoZS50YXJnZXQpLnZhbCgpXG5cbiAgICB1c2UgICAgICAgICAgID0gbnVsbFxuICAgIG1ldGhvZCAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kX3ZhbHVlICA9IG51bGxcbiAgICB1bm1ldG5lZWRzICAgID0gbnVsbFxuICAgIHJlYXNvbiAgICAgICAgPSBudWxsXG4gICAgcmVhc29uX3ZhbHVlICA9IG51bGxcblxuICAgICMgaGlkZSBmaWx0ZXJzICYgY2xlYXIgYWN0aXZlIGJ0bnNcbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5oaWRlKCkuZmluZCgnLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICMgaGlkZSBmaWx0ZXJzIHJlc3VsdHNcbiAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG5cbiAgICBpZiBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXVxuICAgICAgIyBzZXQgZGF0YSB5ZWFyXG4gICAgICBAJGFwcC5maW5kKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEteWVhcicpLmh0bWwgQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ueWVhclxuICAgICAgIyBsb2FkIGNvdW50cnkgZGhzIGRhdGFcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLycrQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ubmFtZSsnX2FsbC5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGQgPSBkYXRhWzBdXG4gICAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIDEwMCpkLnVzaW5nX21vZGVybl9tZXRob2QvZC5uLCBAbWV0aG9kc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX21ldGhvZF0sIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBAcmVhc29uc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX3JlYXNvbl0sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29ucywgQHNlbnRlbmNlc1tAY291bnRyeV9jb2RlXVxuICAgICAgICAjIHNob3cgZmlsdGVyc1xuICAgICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCAnMjAxNS0xNidcbiAgICAgICMgVXNlXG4gICAgICBjb3VudHJ5VXNlID0gQGRhdGEudXNlLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVc2UgYW5kIGNvdW50cnlVc2VbMF1cbiAgICAgICAgaWYgY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXSAhPSAnMCdcbiAgICAgICAgICB1c2UgICAgICAgICAgID0gY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXVxuICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBAbWV0aG9kc0tleXMubWFwIChrZXksIGkpID0+IHsnbmFtZSc6IEBtZXRob2RzTmFtZXNbaV0sICd2YWx1ZSc6ICtjb3VudHJ5VXNlWzBdW2tleV19XG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICBtZXRob2QgICAgICAgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0ubmFtZVxuICAgICAgICBtZXRob2RfdmFsdWUgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0udmFsdWVcbiAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgY291bnRyeVVubWV0bmVlZHMgPSBAZGF0YS51bm1ldG5lZWRzLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgICAjIHVzZSBzdXJ2ZXkgZGF0YSBpZiBhdmFpbGFibGUsIHVzZSBlc3RpbWF0ZWQgaWYgbm90XG4gICAgICAgIHVubWV0bmVlZHMgPSBpZiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gdGhlbiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gZWxzZSBjb3VudHJ5VW5tZXRuZWVkc1swXVsnZXN0aW1hdGVkJ10gXG4gICAgICAjIFJlYXNvbnNcbiAgICAgIGNvdW50cnlSZWFzb25zID0gQGRhdGEucmVhc29ucy5maWx0ZXIgKGQpID0+IGQuY29kZSA9PSBAY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5UmVhc29ucyBhbmQgY291bnRyeVJlYXNvbnNbMF1cbiAgICAgICAgcmVhc29ucyAgICAgID0gT2JqZWN0LmtleXMoQHJlYXNvbnNOYW1lcykubWFwIChyZWFzb24pID0+IHsnbmFtZSc6IEByZWFzb25zTmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2NvdW50cnlSZWFzb25zWzBdW3JlYXNvbl19XG4gICAgICAgIHJlYXNvbnMgICAgICA9IHJlYXNvbnMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgcmVhc29uICAgICAgID0gcmVhc29uc1swXS5uYW1lXG4gICAgICAgIHJlYXNvbl92YWx1ZSA9IHJlYXNvbnNbMF0udmFsdWVcbiAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSwgQHNlbnRlbmNlc1tAY291bnRyeV9jb2RlXVxuXG5cbiAgb25TZWxlY3RGaWx0ZXI6IChlKSA9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIEBmaWx0ZXIgIT0gJChlLnRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUge3Njcm9sbFRvcDogQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykub2Zmc2V0KCkudG9wLTE1fSwgNDAwXG4gICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgQGZpbHRlciA9ICR0YXJnZXQuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnLmNvbnRyYWNlcHRpdmVzLWZpbHRlcicpLmhpZGUoKVxuICAgICAgQGZpbHRlckVsID0gJCgnIycrQGZpbHRlcikuc2hvdygpXG4gICAgICAjIGxvYWQgY3N2IGZpbGVcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLycrQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ubmFtZSsnXycrQGZpbHRlcl9rZXlzW0BmaWx0ZXJdKycuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBpZiBkYXRhXG4gICAgICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEBmaWx0ZXJFbC5maW5kKCcjJytAZmlsdGVyKyctJytkLmlkKSwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG5cblxuICBzZXRBcHBJdGVtRGF0YTogKCRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWUsIHNlbnRlbmNlKSAtPlxuXG4gICAgI2NvbnNvbGUubG9nICdzZXRBcHBJdGVtRGF0YScsICRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgIGlmIHVzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK3VzZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcblxuICAgIGlmIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCttZXRob2RfdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuaGlkZSgpXG5cbiAgICBpZiB1bm1ldG5lZWRzXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK3VubWV0bmVlZHMpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcblxuICAgIGlmIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24nKS5odG1sIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24tdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK3JlYXNvbl92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcblxuICAgIGlmIHNlbnRlbmNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1zZW50ZW5jZScpLmh0bWwoc2VudGVuY2UpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaGlkZSgpXG5cbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cbiAgXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICBzY3JvbGxhbWFJbml0aWFsaXplZCA9IGZhbHNlXG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnI2xhbmcnKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICdodHRwczovL3ByZS5tZWRpY2FtZW50YWxpYS5vcmcvYXNzZXRzJ1xuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBtZXRob2RzX2tleXMgPSBbXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiSVVEXCJcbiAgICBcIkltcGxhbnRcIlxuICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgXCJQaWxsXCJcbiAgICBcIk1hbGUgY29uZG9tXCJcbiAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiXG4gIF1cblxuICBtZXRob2RzX25hbWVzID0gXG4gICAgJ2VzJzogW1xuICAgICAgXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgIFwiRElVXCJcbiAgICAgIFwiaW1wbGFudGVcIlxuICAgICAgXCJpbnllY3RhYmxlXCJcbiAgICAgIFwicMOtbGRvcmFcIlxuICAgICAgXCJjb25kw7NuIG1hc2N1bGlub1wiXG4gICAgICBcImNvbmTDs24gZmVtZW5pbm9cIlxuICAgICAgXCJtw6l0b2RvcyBkZSBiYXJyZXJhIHZhZ2luYWxcIlxuICAgICAgXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgIFwiYW50aWNvbmNlcHRpdm9zIGRlIGVtZXJnZW5jaWFcIlxuICAgICAgXCJvdHJvcyBtw6l0b2RvcyBtb2Rlcm5vc1wiXG4gICAgICBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgIF1cbiAgICAnZW4nOiBbXG4gICAgICBcImZlbWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgIFwibWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgIFwiSVVEXCJcbiAgICAgIFwiaW1wbGFudFwiXG4gICAgICBcImluamVjdGFibGVcIlxuICAgICAgXCJwaWxsXCJcbiAgICAgIFwibWFsZSBjb25kb21cIlxuICAgICAgXCJmZW1hbGUgY29uZG9tXCJcbiAgICAgIFwidmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgICAgXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICBcImVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICAgIFwib3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgICAgXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcbiAgICBdXG5cbiAgbWV0aG9kc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICcxJzogXCJww61sZG9yYVwiXG4gICAgICAnMic6IFwiRElVXCJcbiAgICAgICczJzogXCJpbnllY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kw7NuXCJcbiAgICAgICc2JzogXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgJzcnOiBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgJzgnOiBcImFic3RpbmVuY2lhIHBlcmnDs2RpY2FcIlxuICAgICAgJzknOiBcIm1hcmNoYSBhdHLDoXNcIlxuICAgICAgJzEwJzogXCJvdHJvc1wiXG4gICAgICAnMTEnOiBcImltcGxhbnRlXCJcbiAgICAgICcxMyc6IFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICAnMTcnOiBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgICdlbic6XG4gICAgICAnMSc6IFwicGlsbFwiXG4gICAgICAnMic6IFwiSVVEXCJcbiAgICAgICczJzogXCJpbmplY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kb21cIlxuICAgICAgJzYnOiBcImZlbWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgICc3JzogXCJtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgJzgnOiBcInBlcmlvZGljIGFic3RpbmVuY2VcIlxuICAgICAgJzknOiBcIndpdGhkcmF3YWxcIlxuICAgICAgJzEwJzogXCJvdGhlclwiXG4gICAgICAnMTEnOiBcImltcGxhbnRcIlxuICAgICAgJzEzJzogXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICAnMTcnOiBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuXG5cbiAgIyMjXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG4gICMjI1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICAnZXMnOlxuICAgICAgXCJhXCI6IFwibm8gZXN0w6FuIGNhc2FkYXNcIlxuICAgICAgXCJiXCI6IFwibm8gdGllbmVuIHNleG9cIlxuICAgICAgXCJjXCI6IFwidGllbmVuIHNleG8gaW5mcmVjdWVudGVcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzblwiXG4gICAgICBcImVcIjogXCJzb24gc3ViZmVjdW5kYXMgbyBpbmZlY3VuZGFzXCJcbiAgICAgIFwiZlwiOiBcImFtZW5vcnJlYSBwb3N0cGFydG9cIlxuICAgICAgXCJnXCI6IFwiZXN0w6FuIGRhbmRvIGVsIHBlY2hvXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0YVwiXG4gICAgICBcImlcIjogXCJsYSBtdWplciBzZSBvcG9uZVwiXG4gICAgICBcImpcIjogXCJlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmVcIlxuICAgICAgXCJrXCI6IFwib3Ryb3Mgc2Ugb3BvbmVuXCIgICAgICAgIFxuICAgICAgXCJsXCI6IFwicHJvaGliaWNpw7NuIHJlbGlnaW9zYVwiICBcbiAgICAgIFwibVwiOiBcIm5vIGNvbm9jZSBsb3MgbcOpdG9kb3NcIlxuICAgICAgXCJuXCI6IFwibm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zXCJcbiAgICAgIFwib1wiOiBcInByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIFwicFwiOiBcIm1pZWRvIGEgbG9zIGVmZWN0b3Mgc2VjdW5kYXJpb3MvcHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiBcbiAgICAgIFwicVwiOiBcImZhbHRhIGRlIGFjY2Vzby9tdXkgbGVqb3NcIlxuICAgICAgXCJyXCI6IFwiY3Vlc3RhbiBkZW1hc2lhZG9cIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c29cIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICAgXCJ1XCI6IFwiZWwgbcOpdG9kbyBlbGVnaWRvIG5vIGVzdMOhIGRpc3BvbmlibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gaGF5IG3DqXRvZG9zIGRpc3BvbmlibGVzXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90cm9zXCJcbiAgICAgIFwielwiOiBcIm5vIGxvIHPDqVwiXG4gICAgJ2VuJzpcbiAgICAgIFwiYVwiOiBcIm5vdCBtYXJyaWVkXCJcbiAgICAgIFwiYlwiOiBcIm5vdCBoYXZpbmcgc2V4XCJcbiAgICAgIFwiY1wiOiBcImluZnJlcXVlbnQgc2V4XCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzYWwvaHlzdGVyZWN0b215XCJcbiAgICAgIFwiZVwiOiBcInN1YmZlY3VuZC9pbmZlY3VuZFwiXG4gICAgICBcImZcIjogXCJwb3N0cGFydHVtIGFtZW5vcnJoZWljXCJcbiAgICAgIFwiZ1wiOiBcImJyZWFzdGZlZWRpbmdcIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RpY1wiXG4gICAgICBcImlcIjogXCJyZXNwb25kZW50IG9wcG9zZWRcIlxuICAgICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIlxuICAgICAgXCJrXCI6IFwib3RoZXJzIG9wcG9zZWRcIlxuICAgICAgXCJsXCI6IFwicmVsaWdpb3VzIHByb2hpYml0aW9uXCJcbiAgICAgIFwibVwiOiBcImtub3dzIG5vIG1ldGhvZFwiXG4gICAgICBcIm5cIjogXCJrbm93cyBubyBzb3VyY2VcIlxuICAgICAgXCJvXCI6IFwiaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicFwiOiBcImZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICAgIFwiclwiOiBcImNvc3RzIHRvbyBtdWNoXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCkidzIHByb2Nlc3Nlc1wiXG4gICAgICBcInVcIjogXCJwcmVmZXJyZWQgbWV0aG9kIG5vdCBhdmFpbGFibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdGhlclwiXG4gICAgICBcInpcIjogXCJkb24ndCBrbm93XCJcblxuICByZWFzb25zX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJ3YzYTA4YSc6ICdubyBlc3TDoW4gY2FzYWRhcydcbiAgICAgICd2M2EwOGInOiAnbm8gdGllbmVuIHNleG8nXG4gICAgICAndjNhMDhjJzogJ3RpZW5lbiBzZXhvIGluZnJlY3VlbnRlJ1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuJ1xuICAgICAgJ3YzYTA4ZSc6ICdzb24gc3ViZmVjdW5kYXMgbyBpbmZlY3VuZGFzJ1xuICAgICAgJ3YzYTA4Zic6ICdhbWVub3JyZWEgcG9zdHBhcnRvJ1xuICAgICAgJ3YzYTA4Zyc6ICdlc3TDoW4gZGFuZG8gZWwgcGVjaG8nXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0YSdcbiAgICAgICd2M2EwOGknOiAnbGEgbXVqZXIgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhqJzogJ2VsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGsnOiAnb3Ryb3Mgc2Ugb3BvbmVuJyAgICAgICAgXG4gICAgICAndjNhMDhsJzogJ3Byb2hpYmljacOzbiByZWxpZ2lvc2EnXG4gICAgICAndjNhMDhtJzogJ25vIGNvbm9jZSBsb3MgbcOpdG9kb3MnXG4gICAgICAndjNhMDhuJzogJ25vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvcydcbiAgICAgICd2M2EwOG8nOiAncHJlb2N1cGFjaW9uZXMgZGUgc2FsdWQnXG4gICAgICAndjNhMDhwJzogJ21pZWRvIGEgbG9zIGVmZWN0b3Mgc2VjdW5kYXJpb3MnXG4gICAgICAndjNhMDhxJzogJ2ZhbHRhIGRlIGFjY2Vzby9tdXkgbGVqb3MnXG4gICAgICAndjNhMDhyJzogJ2N1ZXN0YW4gZGVtYXNpYWRvJ1xuICAgICAgJ3YzYTA4cyc6ICdpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzbydcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAnZW4nOiBcbiAgICAgICd2M2EwOGEnOiAnbm90IG1hcnJpZWQnXG4gICAgICAndjNhMDhiJzogJ25vdCBoYXZpbmcgc2V4J1xuICAgICAgJ3YzYTA4Yyc6ICdpbmZyZXF1ZW50IHNleCdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNhbC9oeXN0ZXJlY3RvbXknXG4gICAgICAndjNhMDhlJzogJ3N1YmZlY3VuZC9pbmZlY3VuZCdcbiAgICAgICd2M2EwOGYnOiAncG9zdHBhcnR1bSBhbWVub3JyaGVpYydcbiAgICAgICd2M2EwOGcnOiAnYnJlYXN0ZmVlZGluZydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RpYydcbiAgICAgICd2M2EwOGknOiAncmVzcG9uZGVudCBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4aic6ICdodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGsnOiAnb3RoZXJzIG9wcG9zZWQnXG4gICAgICAndjNhMDhsJzogJ3JlbGlnaW91cyBwcm9oaWJpdGlvbidcbiAgICAgICd2M2EwOG0nOiAna25vd3Mgbm8gbWV0aG9kJ1xuICAgICAgJ3YzYTA4bic6ICdrbm93cyBubyBzb3VyY2UnXG4gICAgICAndjNhMDhvJzogJ2hlYWx0aCBjb25jZXJucydcbiAgICAgICd2M2EwOHAnOiAnZmVhciBvZiBzaWRlIGVmZmVjdHMnXG4gICAgICAndjNhMDhxJzogJ2xhY2sgb2YgYWNjZXNzL3RvbyBmYXInXG4gICAgICAndjNhMDhyJzogJ2Nvc3RzIHRvbyBtdWNoJ1xuICAgICAgJ3YzYTA4cyc6ICdpbmNvbnZlbmllbnQgdG8gdXNlJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmZXJlcyB3aXRoIHRoZSBib2R5J3MgcHJvY2Vzc2VzXCJcblxuXG4gIHNldExvY2F0aW9uID0gKGxvY2F0aW9uLCBjb3VudHJpZXMpIC0+XG4gICAgaWYgbG9jYXRpb25cbiAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGxvY2F0aW9uID0ge31cblxuICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgIyBMb2FkIGxvY2F0aW9uXG4gIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLXBvcHVsYXRpb24tMjAxNi5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgc2V0TG9jYXRpb24gbG9jYXRpb24sIGNvdW50cmllc1xuICAgICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICAgICAgbmV3IENvbnRyYWNlcHRpdmVzQXBwIGxhbmcsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlckNvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lc1tsYW5nXSwgbWV0aG9kc19kaHNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfZGhzX25hbWVzW2xhbmddXG5cbikgalF1ZXJ5XG4iXX0=
