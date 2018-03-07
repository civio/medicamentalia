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
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, reasons_dhs_names, reasons_names, setLocation, userCountry;
    userCountry = {};
    lang = $('body').data('lang');
    baseurl = $('body').data('baseurl');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWNlcHRpdmVzLWFwcC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLXN0YXRpYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztnQ0FFWCxXQUFBLEdBQ0U7TUFBQSx5QkFBQSxFQUEyQixXQUEzQjtNQUNBLHlCQUFBLEVBQTJCLEtBRDNCO01BRUEseUJBQUEsRUFBMkIsV0FGM0I7TUFHQSx5QkFBQSxFQUEyQixRQUgzQjs7O2dDQUtGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FERjtNQUdBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FKRjtNQU1BLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FWRjtNQVlBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FiRjtNQWVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FoQkY7TUFrQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsTUFEUjtPQW5CRjtNQXFCQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsVUFBUjtRQUNBLE1BQUEsRUFBUSxNQURSO09BdEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0F6QkY7TUEyQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsU0FEUjtPQTVCRjtNQThCQSxLQUFBLEVBQ0U7UUFBQSxN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QUFDLElBTFosRUFLa0IsT0FBQSxHQUFRLDBCQUwxQixDQU1FLENBQUMsS0FOSCxDQU1TLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsZUFBbEIsRUFBbUMsWUFBbkMsRUFBaUQsU0FBakQsRUFBNEQsR0FBNUQ7UUFDTCxXQUFBLENBQVksUUFBWixFQUFzQixTQUF0QjtRQUNBLElBQUcsQ0FBQSxDQUFFLHFCQUFGLENBQXdCLENBQUMsTUFBNUI7aUJBQ00sSUFBQSxpQkFBQSxDQUFrQixJQUFsQixFQUF3QixRQUF4QixFQUFrQyxlQUFsQyxFQUFtRCxZQUFuRCxFQUFpRSxXQUFqRSxFQUE4RSxZQUE5RSxFQUE0RixhQUFjLENBQUEsSUFBQSxDQUExRyxFQUFpSCxpQkFBa0IsQ0FBQSxJQUFBLENBQW5JLEVBQTBJLGFBQWMsQ0FBQSxJQUFBLENBQXhKLEVBQStKLGlCQUFrQixDQUFBLElBQUEsQ0FBakwsRUFETjs7TUFGSyxDQU5UO0lBRnFDLENBQXZDO0VBdE9ELENBQUQsQ0FBQSxDQW1QRSxNQW5QRjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLXN0YXRpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc0FwcFxuXG4gIGZpbHRlcl9rZXlzOiBcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTAnOiAncmVzaWRlbmNlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMSc6ICdhZ2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0yJzogJ2VkdWNhdGlvbidcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTMnOiAnd2VhbHRoJ1xuXG4gIGRoc19jb3VudHJpZXM6XG4gICAgJ0FGRyc6XG4gICAgICAnbmFtZSc6ICdBRklSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTcnXG4gICAgJ0FMQic6XG4gICAgICAnbmFtZSc6ICdBTElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ0FSTSc6XG4gICAgICAnbmFtZSc6ICdBTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0FHTyc6XG4gICAgICAnbmFtZSc6ICdBT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0FaRSc6XG4gICAgICAnbmFtZSc6ICdBWklSNTJEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JHRCc6XG4gICAgICAnbmFtZSc6ICdCRElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0JFTic6XG4gICAgICAnbmFtZSc6ICdCSklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JPTCc6XG4gICAgICAnbmFtZSc6ICdCT0lSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ0JESSc6XG4gICAgICAnbmFtZSc6ICdCVUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0NPRCc6XG4gICAgICAnbmFtZSc6ICdDRElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ0NPRyc6XG4gICAgICAnbmFtZSc6ICdDR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NJVic6XG4gICAgICAnbmFtZSc6ICdDSUlSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NNUic6XG4gICAgICAnbmFtZSc6ICdDTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ0NPTCc6XG4gICAgICAnbmFtZSc6ICdDT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0RPTSc6XG4gICAgICAnbmFtZSc6ICdEUklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0VHWSc6XG4gICAgICAnbmFtZSc6ICdFR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0VUSCc6XG4gICAgICAnbmFtZSc6ICdFVElSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ0dIQSc6XG4gICAgICAnbmFtZSc6ICdHSElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0dNQic6XG4gICAgICAnbmFtZSc6ICdHTUlSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0dJTic6XG4gICAgICAnbmFtZSc6ICdHTklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0dUTSc6XG4gICAgICAnbmFtZSc6ICdHVUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ0dVWSc6XG4gICAgICAnbmFtZSc6ICdHWUlSNUlEVCdcbiAgICAgICd5ZWFyJzogJzIwMDknXG4gICAgJ0hORCc6XG4gICAgICAnbmFtZSc6ICdITklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0hUSSc6XG4gICAgICAnbmFtZSc6ICdIVElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0lORCc6XG4gICAgICAnbmFtZSc6ICdJQUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ0lETic6XG4gICAgICAnbmFtZSc6ICdJRElSNjNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0pPUic6XG4gICAgICAnbmFtZSc6ICdKT0lSNkNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0tFTic6XG4gICAgICAnbmFtZSc6ICdLRUlSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0tITSc6XG4gICAgICAnbmFtZSc6ICdLSElSNzNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0xCUic6XG4gICAgICAnbmFtZSc6ICdMQklSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0xTTyc6XG4gICAgICAnbmFtZSc6ICdMU0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ01BUic6XG4gICAgICAnbmFtZSc6ICdNQUlSNDNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDMtMDQnXG4gICAgJ01ERyc6XG4gICAgICAnbmFtZSc6ICdNRElSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ01MSSc6XG4gICAgICAnbmFtZSc6ICdNTElSNTNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ01NUic6XG4gICAgICAnbmFtZSc6ICdNTUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ01XSSc6XG4gICAgICAnbmFtZSc6ICdNV0lSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ01PWic6XG4gICAgICAnbmFtZSc6ICdNWklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ05HQSc6XG4gICAgICAnbmFtZSc6ICdOR0lSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05FUic6XG4gICAgICAnbmFtZSc6ICdOSUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ05BTSc6XG4gICAgICAnbmFtZSc6ICdOTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05QTCc6XG4gICAgICAnbmFtZSc6ICdOUElSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ1BFUic6XG4gICAgICAnbmFtZSc6ICdQRUlSNklEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1BITCc6XG4gICAgICAnbmFtZSc6ICdQSElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1BBSyc6XG4gICAgICAnbmFtZSc6ICdQS0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1JXQSc6XG4gICAgICAnbmFtZSc6ICdSV0lSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ1NMRSc6XG4gICAgICAnbmFtZSc6ICdTTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1NFTic6XG4gICAgICAnbmFtZSc6ICdTTklSNkREVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1NUUCc6XG4gICAgICAnbmFtZSc6ICdTVElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ1NXWic6XG4gICAgICAnbmFtZSc6ICdTWklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ1RDRCc6XG4gICAgICAnbmFtZSc6ICdURElSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ1RHTyc6XG4gICAgICAnbmFtZSc6ICdUR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ1RKSyc6XG4gICAgICAnbmFtZSc6ICdUSklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1RMUyc6XG4gICAgICAnbmFtZSc6ICdUTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDktMTAnXG4gICAgJ1RaQSc6XG4gICAgICAnbmFtZSc6ICdUWklSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ1VHQSc6XG4gICAgICAnbmFtZSc6ICdVR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ1pNQic6XG4gICAgICAnbmFtZSc6ICdaTUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDcnXG4gICAgJ1pXRSc6XG4gICAgICAnbmFtZSc6ICdaV0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG5cbiAgc2VudGVuY2VzOiBcbiAgICAnZXMnOlxuICAgICAgJ0FMQic6ICdMYSBtYXJjaGEgYXRyw6FzIGVzIGVsIHByaW1lciBtw6l0b2RvIGFudGljb25jZXB0aXZvIGRlIEFsYmFuaWEuIEFkZW3DoXMsIHNlIHRyYXRhIGRlbCBzZWd1bmRvIHBhw61zIGRvbmRlIGV4aXN0ZSBtYXlvciBvcG9zaWNpw7NuIGRlIGxhIHByb3BpYSBtdWplciwgbGEgcGFyZWphIG8gbGEgcmVsaWdpw7NuIGEgdG9tYXIgYW50aWNvbmNlcHRpdm9zLidcbiAgICAgICdBUkcnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNsYXJpbi5jb20vc29jaWVkYWQvY2FtcGFuYS1sZXktYWJvcnRvLWNvbWVuem8tMjAwNS1wcm95ZWN0by1wcmVzZW50by12ZWNlc18wX0JKdmRpMG5Qei5odG1sXCI+VW5hcyBjaW5jbyBtaWwgbXVqZXJlcyBtYXJjaGFyb24gZW4gZmVicmVybyBkZSAyMDE4IGZyZW50ZSBhbCBDb25ncmVzbyBhcmdlbnRpbm8gcGFyYSBwZWRpciBsYSBsZWdhbGl6YWNpw7NuIGRlbCBhYm9ydG8uPC9hPidcbiAgICAgICdBVVMnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYWJjLm5ldC5hdS9uZXdzL2hlYWx0aC8yMDE3LTA3LTIyL25hdHVyYWwtbWV0aG9kcy1vZi1jb250cmFjZXB0aW9uLW9uLXRoZS1yaXNlLWluLWF1c3RyYWxpYS84NjgzMzQ2XCI+TXVjaG9zIGF1c3RyYWxpYW5vcyBlc3TDoW4gdm9sdmllbmRvIGEgdXRpbGl6YXIgbcOpdG9kb3MgdHJhZGljaW9uYWxlcyBkZSBhbnRpY29uY2VwY2nDs24sIHNlZ8O6biB1biBlc3R1ZGlvIGRlIE1vbmFzaCBVbml2ZXJzaXR5LjwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5Cw6lsZ2ljYSBkb27DsyAxMCBtaWxsb25lcyBkZSBldXJvcyBwYXJhIGxhIGNhbXBhw7FhIDxpPlNoZSBEZWNpZGVzPC9pPiwgbGFuemFkYSBwb3IgZWwgR29iaWVybm8gaG9sYW5kw6lzIHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ0JPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZWZlLmNvbS9lZmUvYW1lcmljYS9zb2NpZWRhZC9sYS12ZXJnw7xlbnphLXktZWwtZXN0aWdtYS1kZS1wZWRpci1wcmVzZXJ2YXRpdm9zLWVuLWJvbGl2aWEvLzIwMDAwMDEzLTMyNjU2NTJcIj5GYXJtYWNpYXMgZGUgQm9saXZpYSBpbXBsZW1lbnRhcm9uIGPDs2RpZ29zIHNlY3JldG9zIHBhcmEgcGVkaXIgcHJlc2VydmF0aXZvcyB5IGV2aXRhciBlbCBlc3RpZ21hIGRlIGNvbXByYXIgZXN0b3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnQ09MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCI+RWwgR29iaWVybm8gY2hpbm8gb2ZyZWNlIGxhIHJldGlyYWRhIGdyYXR1aXRhIGRlIERJVXMgZGVzcHXDqXMgZGUgbGEgcG9sw610aWNhIGRlbCBoaWpvIMO6bmljby48L2E+J1xuICAgICAgJ1NMVic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC1wcm9mZXNzaW9uYWxzLW5ldHdvcmsvZ2FsbGVyeS8yMDE3L21heS8yNi9yZXByb2R1Y3RpdmUtcmlnaHRzLXppa2Etd29tZW4tZWwtc2FsdmFkb3ItaW4tcGljdHVyZXNcIj5FbCBTYWx2YWRvciBlcyBlbCDDum5pY28gcGHDrXMgZGVsIG11bmRvIGRvbmRlIGFib3J0YXIgZXN0w6EgcGVuYWRvIGNvbiBjw6FyY2VsLjwvYT4nXG4gICAgICAnRklOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmhlbHNpbmtpdGltZXMuZmkvZmlubGFuZC9maW5sYW5kL25ld3MvZG9tZXN0aWMvMTUyNzEtaGVsc2lua2ktdG8tb2ZmZXIteWVhci1zLXdvcnRoLW9mLWNvbnRyYWNlcHRpdmUtcGlsbHMtdG8tdW5kZXItMjUteWVhci1vbGRzLmh0bWxcIj5FbCBheXVudGFtaWVudG8gZGUgSGVsc2lua2kgcHJvcG9yY2lvbmEgYW50aWNvbmNlcHRpdm9zIGRlIG1hbmVyYSBncmF0dWl0YSBhIGxvcyBqw7N2ZW5lcyBtZW5vcmVzIGRlIDI1IGHDsW9zLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiPkVsIHVzbyBkZSBsYXMgcGFzdGlsbGFzIGFudGljb25jZXB0aXZhcyBzZSBoYSByZWR1Y2lkbyBlbiBGcmFuY2lhIGRlc2RlIDIwMTAuPC9hPidcbiAgICAgICdHTUInOiAnRW4gR2FtYmlhLCBtdWNoYXMgbXVqZXJlcyB1dGlsaXphbiB1biBtw6l0b2RvIHRyYWRpY2lvbmFsIHF1ZSBjb25zaXN0ZSBlbiBhdGFyIGEgbGEgY2ludHVyYSB1bmEgY3VlcmRhLCB1bmEgcmFtYSwgbyB1biBwYXBlbGl0byBjb24gbyBzaW4gZnJhc2VzIGRlbCBDb3LDoW4uJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIj5VbiBwcm95ZWN0byBhbGVtw6FuIGZhY2lsaXRhIGFudGljb25jZXB0aXZvcyBkZSBmb3JtYSBncmF0dWl0YSBhIG11amVyZXMgZGUgbcOhcyBkZSAyMCBhw7FvcyBjb24gaW5ncmVzb3MgYmFqb3MuPC9hPidcbiAgICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIj5MYSByZWxpZ2nDs24gaW5mbHV5ZSBlbiBsYSBlZHVjYWNpw7NuIHNleHVhbCBkZSBsb3MgasOzdmVuZXMgZ3VhdGVtYWx0ZWNvcy48L2E+J1xuICAgICAgJ0lTUic6ICdFbiBsb3Mgc2VjdG9yZXMganVkw61vcyBtw6FzIG9ydG9kb3hvcywgc29sbyBwdWVkZW4gdXNhcnNlIGxvcyBhbnRpY29uY2VwdGl2b3Mgc2kgZWwgcmFiaW5vIGRhIHN1IHBlcm1pc28gYSBsYSBtdWplci4nXG4gICAgICAnSlBOJzogJ0phcMOzbiwgYXVucXVlIHNlIGVuY3VlbnRyYSBlbiBlbCBncnVwbyBkZSBwYcOtc2VzIGNvbiByZW50YSBhbHRhLCBlcyBsYSBleGNlcGNpw7NuOiBsYXMgbmVjZXNpZGFkZXMgbm8gY3ViaWVydGFzIGNvbiBhbnRpY29uY2VwdGl2b3MgZXN0w6EgYWwgbml2ZWwgZGUgcGHDrXNlcyBjb24gcmVudGFzIGJhamFzLidcbiAgICAgICdQUksnOiAnRWwgOTUlIGRlIG11amVyZXMgcXVlIHV0aWxpemFuIGFudGljb25jZXB0aXZvcyBlbiBDb3JlYSBkZWwgTm9ydGUgaGFuIGVsZWdpZG8gZWwgRElVLiBTZSB0cmF0YSBkZWwgbWF5b3IgcG9yY2VudGFqZSBkZSB1c28gYSBuaXZlbCBtdW5kaWFsLidcbiAgICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiPkVsIGdvYmllcm5vIGhvbGFuZMOpcyBsYW56YSBlbCBwcm95ZWN0byA8aT5TaGUgRGVjaWRlczwvaT4gcGFyYSBjb250cmFycmVzdGFyIGxhIHJldGlyYWRhIGRlIGZvbmRvcyBwYXJhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIGRlIFRydW1wLjwvYT4nXG4gICAgICAnUEVSJzogJzxhIGhyZWY9XCJodHRwczovL2ludGVyYWN0aXZlLnF1aXB1LXByb2plY3QuY29tLyMvZXMvcXVpcHUvaW50cm9cIj5FbiBsYSDDqXBvY2EgZGUgbG9zIDkwLCBkdXJhbnRlIGVsIGdvYmllcm5vIGRlIEZ1amltb3JpLCBtw6FzIGRlIDI1MC4wMDAgbXVqZXJlcyBmdWVyb24gZXN0ZXJpbGl6YWRhcyBzaW4gc3UgY29uc2VudGltaWVudG8uPC9hPidcbiAgICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIj4gRW4gdW4gcGHDrXMgZG9uZGUgZWwgYWJvcnRvIGRlbCBlc3TDoSBwcm9oaWJpZG8sIHRyZXMgbXVqZXJlcyBtdWVyZW4gYWwgZMOtYSBwb3IgY29tcGxpY2FjaW9uZXMgZGVyaXZhZGFzIGRlIGludGVydmVuY2lvbmVzIGlsZWdhbGVzLjwvYT4nXG4gICAgICAnUE9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5hbW5lc3R5Lm9yZy9lbi9sYXRlc3QvbmV3cy8yMDE3LzA2L3BvbGFuZC1lbWVyZ2VuY3ktY29udHJhY2VwdGlvbi1yZXN0cmljdGlvbnMtY2F0YXN0cm9waGljLWZvci13b21lbi1hbmQtZ2lybHMvXCI+RWwgR29iaWVybm8gcG9sYWNvIGRhIHVuIHBhc28gYXRyw6FzIHkgc2UgY29udmllcnRlIGVuIGVsIMO6bmljbyBwYcOtcyBkZSBsYSBVbmnDs24gRXVyb3BlYSBkb25kZSBsYSBwYXN0aWxsYSBkZWwgZMOtYSBkZXNwdcOpcyBlc3TDoSBzdWpldGEgYSBwcmVzY3JpcGNpw7NuLjwvYT4nXG4gICAgICAnU1NEJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvbWF5LzI1L2V2ZXJ5LXllYXItaS1naXZlLWJpcnRoLXdhci1kcml2aW5nLWNvbnRyYWNlcHRpb24tY3Jpc2lzLXN1ZGFuLW51YmEtbW91bnRhaW5zXCI+TGEgZ3VlcnJhIGVuIFN1ZMOhbiBlc3TDoSBjcmVhbmRvIHVuYSBjcmlzaXMgZW4gZWwgYWNjZXNvIGEgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIj5NYWRyaWQgZXMgbGEgw7puaWNhIGNvbXVuaWRhZCBxdWUgbm8gZmluYW5jaWEgYW50aWNvbmNlcHRpdm9zIGNvbiBzdXMgZm9uZG9zLjwvYT4nXG4gICAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIj5FcmRvZ2FuIGRlY2xhcmEgcXVlIGxhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIG5vIGVzIHBhcmEgbG9zIG11c3VsbWFuZXMuPC9hPidcbiAgICAgICdVR0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm5ld3Zpc2lvbi5jby51Zy9uZXdfdmlzaW9uL25ld3MvMTQ1ODg4Mi91Z2FuZGEtZmFjaW5nLTE1MC1taWxsaW9uLWNvbmRvbS1zaG9ydGZhbGxcIj5FbiAyMDE3LCBlbCBNaW5pc3RlcmlvIGRlIFNhbHVkIGRlIFVnYW5kYSBkZWNsYXJhYmEgdW4gZGVzYWJhc3RlY2ltaWVudG8gZGUgMTUwIG1pbGxvbmVzIGRlIHByZXNlcnZhdGl2b3MgbWFzY3VsaW5vcy48L2E+J1xuICAgICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCI+RW4gSXJsYW5kYSBlcyBpbGVnYWwgYWJvcnRhciBhIG5vIHNlciBxdWUgaGF5YSB1biByaWVzZ28gcmVhbCBkZSBzYWx1ZCBwYXJhIGxhIG1hZHJlLjwvYT4nXG4gICAgICAnVVNBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE4LzAxLzE4L3VzL2hlYWx0aC1jYXJlLW9mZmljZS1hYm9ydGlvbi1jb250cmFjZXB0aW9uLmh0bWxcIj5UcnVtcCBkYSBhIGxvcyBtw6lkaWNvcyBsaWJlcnRhZCBwYXJhIG5lZ2Fyc2UgYSByZWFsaXphciBwcm9jZWRpbWllbnRvcyBlbiBjb250cmEgZGUgc3VzIGNyZWVuY2lhcyByZWxpZ2lvc2FzLCBjb21vIGVsIGFib3J0by48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCI+TGEgZXNjYXNleiB5IGVsIHByZWNpbyBlbGV2YWRvIGRlIGxvcyBhbnRpY29uY2VwdGl2b3MgZW4gVmVuZXp1ZWxhIGluZmx1eWUgZW4gZWwgYXVtZW50byBkZSBlbWJhcmF6b3Mgbm8gZGVzZWFkb3MuPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCI+VW4gcHJveWVjdG8gZW4gWmFtYmlhICB1bmUgbGEgbWFuaWN1cmEgeSBsb3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgJ2VuJzpcbiAgICAgICdBTEInOiAnV2l0aGRyYXduIGlzIHRoZSBtb3N0IHVzZWQgY29udHJhY2VwdGl2ZSBtZXRob2QgYnkgQWxiYW5pYW4gd29tZW4uIEZ1cnRoZXJtb3JlLCBpdCBpcyB0aGUgc2Vjb25kIGNvdW50cnkgd2hlcmUgdGhlIG9wcG9zaXRpb24gb2YgdGhlIHJlc3BvbmRlbnQsIHRoZSBwYXJ0bmVyIG9yIHRoZSByZWxpZ2lvbiB0byB1c2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIGlzIHRoZSBtYWluIGJhcnJpZXIgZm9yIHVzaW5nIHRoZW0gd2hlbiB0aGV5IGFyZSBuZWVkZWQuJ1xuICAgICAgJ0FSRyc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY2xhcmluLmNvbS9zb2NpZWRhZC9jYW1wYW5hLWxleS1hYm9ydG8tY29tZW56by0yMDA1LXByb3llY3RvLXByZXNlbnRvLXZlY2VzXzBfQkp2ZGkwblB6Lmh0bWxcIj5BcHByb3hpbWF0ZWx5IGZpdmUgdGhvdXNhbmQgd29tZW4gbWFyY2hlZCBpbiBGZWJydWFyeSAyMDE4IGluIGZyb250IG9mIHRoZSBBcmdlbnRpbmUgQ29uZ3Jlc3MgdG8gZGVtYW5kIHRoZSBsZWdhbGl6YXRpb24gb2YgYWJvcnRpb24uIDwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiPk5hdHVyYWwgbWV0aG9kcyBvZiBjb250cmFjZXB0aW9uIG9uIHRoZSByaXNlIGluIEF1c3RyYWxpYSwgYWNjb3JkaW5nIHRvIGFuIGludmVzdGlnYXRpb24gb2YgTW9uYXNoIFVuaXZlcnNpdHkuIDwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIj5CZWxnaXVtIGhhdmUgZG9uYXRlZCAxMCBtaWxsaW9uIGV1cm9zIHRvIHRoZSA8aT5TaGUgRGVjaWRlczwvaT4gcHJveWVjdCwgbGF1bmNoZWQgYnkgdGhlIER1dGNoIGdvdmVybm1lbnQgdG8gYm9vc3QgY29udHJhY2VwdGlvbiBpbiBkZXZlbG9waW5nIGNvdW50cmllcy4gPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCI+Qm9saXZpYVxcJ3MgcGhhcm1hY2llcyBoYXZlIGRldmVsb3BlZCBhIHNlY3JldCBjb2RlIHRvIGFzayBmb3IgY29uZG9tcyBhbmQgdGhlcmVmb3JlLCB0byBhdm9pZCBzdGlnbWEgYWJvdXQgYnV5aW5nIHRoZW0uPC9hPidcbiAgICAgICdDT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTcvMDEvMDcvd29ybGQvYXNpYS9hZnRlci1vbmUtY2hpbGQtcG9saWN5LW91dHJhZ2UtYXQtY2hpbmFzLW9mZmVyLXRvLXJlbW92ZS1pdWRzLmh0bWxcIj5BZnRlciBvbmUgY2hpbGQgcG9saWNpeSwgb3V0cmFnZSBhdCBDaGluYVxcJ3Mgb2ZmZXIgdG8gcmVtb3ZlIElVRHMuPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCI+RWwgU2FsdmFkb3IgaXMgb25lIG9mIHNpeCBjb3VudHJpZXMgd2hlcmUgYWJvcnRpb24gaXMgYmFubmVkIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLCBhbmQgd29tZW4gd2hvIHVuZGVyZ28gaXQgY291bGQgZmFjZSBwcmlzb24gPC9hPidcbiAgICAgICdGSU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuaGVsc2lua2l0aW1lcy5maS9maW5sYW5kL2ZpbmxhbmQvbmV3cy9kb21lc3RpYy8xNTI3MS1oZWxzaW5raS10by1vZmZlci15ZWFyLXMtd29ydGgtb2YtY29udHJhY2VwdGl2ZS1waWxscy10by11bmRlci0yNS15ZWFyLW9sZHMuaHRtbFwiPkhlbHNpbmtpIHRvIG9mZmVyIHllYXLigJlzIHdvcnRoIG9mIGNvbnRyYWNlcHRpdmUgcGlsbHMgdG8gdW5kZXIgMjUteWVhci1vbGRzLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiPkZyZW5jaCB3b21lbiBvcHQgZm9yIGFsdGVybmF0aXZlcyBhcyBQaWxsIHVzZSBkcm9wcy48L2E+J1xuICAgICAgJ0dNQic6ICdJbiBUaGUgR2FtYmlhLCBtYW55IHdvbWVuIHVzZSBhIHRyYWRpdGlvbmFsIG1ldGhvZCB0aGF0IGludm9sdmVzIHR5aW5nIGEgcm9wZSwgYSBicmFuY2ggb3IgYSBwaWVjZSBvZiBwYXBlciBhcm91bmQgdGhlIHdhaXN0IHdpdGggLW9yIHdpdGhvdXQtIHBocmFzZXMgZnJvbSB0aGUgS29yYW4gaW4gaXQuJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIj5BIHRyaWFsIHNjaGVtZSBpbiBHZXJtYW55IGlzIGhlbHBpbmcgd29tZW4gb24gbG93IGluY29tZXMgdG8gYXZvaWQgc2FjcmlmaWNpbmcgdGhlaXIgY29udHJhY2VwdGlvbi48L2E+J1xuICAgICAgJ0dUTSc6ICc8YSBocmVmPVwiaHR0cDovL2J1ZmYubHkvMnRhWXdjb1wiPlJlbGlnaW9uIGhhcyBhIG1ham9yIGluZmx1ZW5jZSBpbiBzZXh1YWwgZWR1Y2F0aW9uIG9mIEd1YXRlbWFsYSB5b3VuZyBwZW9wbGUuPC9hPidcbiAgICAgICdJU1InOiAnSW4gdWx0cmEgb3J0aG9kb3gganVkYWlzbSwgY29udHJhY2VwdGl2ZSB1c2UgaXMgb25seSBwZXJtaXR0ZWQgaWYgdGhlIHJhYmJpIGdpdmVzIHByZXZpb3VzIHBlcm1pc3Npb24gdG8gdGhlIHdvbWFuLidcbiAgICAgICdKUE4nOiAnSmFwYW4sIGV2ZW4gaWYgaXQgaXMgcGFydCBvZiB0aGUgZ3JvdXAgb2YgY291bnRyaWVzIHdpdGggaGlnaCBpbmNvbWUsIGhhcyB1bm1ldCBuZWVkcyBmb3IgY29udHJhY2VwdGlvbiBhdCB0aGUgbGV2ZWwgb2YgY291bnRyaWVzIHdpdGggbG93IGluY29tZS4nXG4gICAgICAnUFJLJzogJzk1JSBvZiB3b21lbiB3aG8gdXNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyBpbiBOb3J0aCBLb3JlYSBoYXZlIGNob3NlbiB0byB1c2UgSVVEcy4gSXQgaXMgdGhlIGhpZ2hlc3QgcGVyY2VudGFnZSBvZiB1c2Ugb2YgdGhpcyBtZXRob2Qgd29ybGR3aWRlLidcbiAgICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiPkR1dGNoIGluaXRpYXRpdmUgYnJpbmdzIGluIOKCrDE4MW0gZm9yIGZhbWlseSBwbGFubmluZyBjYW1wYWlnbi48L2E+J1xuICAgICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCI+SW4gdGhlIDE5OTBzLCBBbGJlcnRvIEZ1amltb3JpLCBmb3JtZXIgcHJlc2lkZW50IG9mIFBlcnUsIGxhdW5jaGVkIGEgbmV3IGZhbWlseSBwbGFubmluZyBwcm9ncmFtbWUgdGhhdCByZXN1bHRlZCBpbiB0aGUgc3RlcmlsaXNhdGlvbiBvZiAyNzIsMDI4IHdvbWVuIGFuZCAyMiwwMDQgbWVuIGluIG9ubHkgNCB5ZWFycy48L2E+J1xuICAgICAgJ1BITCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L2p1bC8xMC9ob3ctYml0dGVyLWhlcmJzLWFuZC1ib3RjaGVkLWFib3J0aW9ucy1raWxsLXRocmVlLXdvbWVuLWEtZGF5LWluLXRoZS1waGlsaXBwaW5lc1wiPiBIb3cgYml0dGVyIGhlcmJzIGFuZCBib3RjaGVkIGFib3J0aW9ucyBraWxsIHRocmVlIHdvbWVuIGEgZGF5IGluIHRoZSBQaGlsaXBwaW5lcy48L2E+J1xuICAgICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiPlBvbGlzaCBHb3Zlcm5tZW50IHRha2VzIGEgc3RlcCBiYWNrIGluIHRoZSBhY2Nlc3MgdG8gdGhlIFwibW9ybmluZy1hZnRlclwiIHBpbGwgYW5kIGl0IGJlY29tZXMgdGhlIG9ubHkgRXVyb3BlYW4gY291bnRyeSB3aGVyZSB3b21lbiBuZWVkIGEgcHJlc2NyaXB0aW9uIGZvciB0aGUgdXNlIG9mIHRoaXMgY29udHJhY2VwdGl2ZSBtZXRob2QuPC9hPidcbiAgICAgICdTU0QnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9tYXkvMjUvZXZlcnkteWVhci1pLWdpdmUtYmlydGgtd2FyLWRyaXZpbmctY29udHJhY2VwdGlvbi1jcmlzaXMtc3VkYW4tbnViYS1tb3VudGFpbnNcIj5cXCdFdmVyeSB5ZWFyLCBJIGdpdmUgYmlydGhcXCc6IHdoeSB3YXIgaXMgZHJpdmluZyBhIGNvbnRyYWNlcHRpb24gY3Jpc2lzIGluIFN1ZGFuLjwvYT4nXG4gICAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIj5NYWRyaWQgaXMgdGhlIG9ubHkgcmVnaW9uYWwgZ292ZXJubWVudCB0aGF0IGRvZXMgbm90IGZpbmFuY2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIHdpdGggaXRzIGZ1bmRzLjwvYT4nXG4gICAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIj5UdXJrZXlcXCdzIEVyZG9nYW4gd2FybnMgTXVzbGltcyBhZ2FpbnN0IGJpcnRoIGNvbnRyb2wuPC9hPidcbiAgICAgICdVR0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm5ld3Zpc2lvbi5jby51Zy9uZXdfdmlzaW9uL25ld3MvMTQ1ODg4Mi91Z2FuZGEtZmFjaW5nLTE1MC1taWxsaW9uLWNvbmRvbS1zaG9ydGZhbGxcIj5JbiAyMDE3LCBVZ2FuZGEgZmFjZWQgYSAxNTAgbWlsbGlvbnMgbWFsZSBjb25kb21zIHNob3J0ZmFsbC48L2E+J1xuICAgICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCI+SXJpc2ggcmVmZXJlbmR1bSBvbiBhYm9ydGlvbiByZWZvcm0gdG8gYmUgaGVsZCBieSBlbmQgb2YgTWF5IDIwMTg8L2E+J1xuICAgICAgJ1VTQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxOC8wMS8xOC91cy9oZWFsdGgtY2FyZS1vZmZpY2UtYWJvcnRpb24tY29udHJhY2VwdGlvbi5odG1sXCI+VHJ1bXAgZ2l2ZXMgaGVhbHRoIHdvcmtlcnMgbmV3IHJlbGlnaW91cyBsaWJlcnR5IHByb3RlY3Rpb25zLjwvYT4nXG4gICAgICAnVkVOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbXVuZG8vbm90aWNpYXMtYW1lcmljYS1sYXRpbmEtNDI2MzU0MTJcIj5UaGUgc2hvcnRhZ2UgYW5kIGhpZ2ggcHJpY2Ugb2YgY29udHJhY2VwdGl2ZXMgaW4gVmVuZXp1ZWxhIGluZmx1ZW5jZXMgdGhlIGluY3JlYXNlIGluIHVud2FudGVkIHByZWduYW5jaWVzPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCI+SW4gWmFtYmlhLCBhIHJhZGljYWwgbmV3IGFwcHJvYWNoIHRvIGNvbnRyYWNlcHRpb24gaXMgZ2l2aW5nIGFkb2xlc2NlbnQgZ2lybHMgdGhlIGluZm9ybWF0aW9uIGFuZCBzZXJ2aWNlcyBvZiBjb250cmFjZXB0aW9uIHdoaWxlIGRvaW5nIHRoZSBtYW5pY3VyZS48L2E+J1xuXG5cbiAgY29uc3RydWN0b3I6IChsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJfY291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzLCBtZXRob2RzX2Roc19uYW1lcywgcmVhc29uc19uYW1lcywgcmVhc29uc19kaHNfbmFtZXMpIC0+XG5cbiAgICBAc2VudGVuY2VzID0gQHNlbnRlbmNlc1tsYW5nXVxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBAY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgIyBoaWRlIGZpbHRlcnMgJiBjbGVhciBhY3RpdmUgYnRuc1xuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLmhpZGUoKS5maW5kKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgIyBoaWRlIGZpbHRlcnMgcmVzdWx0c1xuICAgICQoJy5jb250cmFjZXB0aXZlcy1maWx0ZXInKS5oaWRlKClcblxuICAgIGlmIEBkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS55ZWFyXG4gICAgICAjIGxvYWQgY291bnRyeSBkaHMgZGF0YVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgZCA9IGRhdGFbMF1cbiAgICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAgICMgc2hvdyBmaWx0ZXJzXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICMgc2V0IGRhdGEgeWVhclxuICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sICcyMDE1LTE2J1xuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVzZSBhbmQgY291bnRyeVVzZVswXVxuICAgICAgICBpZiBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddICE9ICcwJ1xuICAgICAgICAgIHVzZSAgICAgICAgICAgPSBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIG1ldGhvZCAgICAgICAgICA9IGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICBjb3VudHJ5VW5tZXRuZWVkcyA9IEBkYXRhLnVubWV0bmVlZHMuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVubWV0bmVlZHMgYW5kIGNvdW50cnlVbm1ldG5lZWRzWzBdXG4gICAgICAgICMgdXNlIHN1cnZleSBkYXRhIGlmIGF2YWlsYWJsZSwgdXNlIGVzdGltYXRlZCBpZiBub3RcbiAgICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXSBcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7c2Nyb2xsVG9wOiBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5vZmZzZXQoKS50b3AtMTV9LCA0MDBcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcblxuXG4gIHNldEFwcEl0ZW1EYXRhOiAoJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSwgc2VudGVuY2UpIC0+XG5cbiAgICAjY29uc29sZS5sb2cgJ3NldEFwcEl0ZW1EYXRhJywgJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZVxuXG4gICAgaWYgdXNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVzZScpLmh0bWwgTWF0aC5yb3VuZCgrdXNlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLmhpZGUoKVxuXG4gICAgaWYgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kJykuaHRtbCBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK21ldGhvZF92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1tZXRob2QnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1tZXRob2QnKS5oaWRlKClcblxuICAgIGlmIHVubWV0bmVlZHNcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrdW5tZXRuZWVkcykrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLmhpZGUoKVxuXG4gICAgaWYgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrcmVhc29uX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuXG4gICAgaWYgc2VudGVuY2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaHRtbChzZW50ZW5jZSkuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtc2VudGVuY2UnKS5oaWRlKClcblxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuICBcbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcImltcGxhbnRlXCJcbiAgICAgIFwiaW55ZWN0YWJsZVwiXG4gICAgICBcInDDrWxkb3JhXCJcbiAgICAgIFwiY29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJjb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwibcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcImFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwib3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJmZW1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICBcIm1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcImltcGxhbnRcIlxuICAgICAgXCJpbmplY3RhYmxlXCJcbiAgICAgIFwicGlsbFwiXG4gICAgICBcIm1hbGUgY29uZG9tXCJcbiAgICAgIFwiZmVtYWxlIGNvbmRvbVwiXG4gICAgICBcInZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJlbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIm90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gIG1ldGhvZHNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAnMSc6IFwicMOtbGRvcmFcIlxuICAgICAgJzInOiBcIkRJVVwiXG4gICAgICAnMyc6IFwiaW55ZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZMOzblwiXG4gICAgICAnNic6IFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgICc3JzogXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgICc4JzogXCJhYnN0aW5lbmNpYSBwZXJpw7NkaWNhXCJcbiAgICAgICc5JzogXCJtYXJjaGEgYXRyw6FzXCJcbiAgICAgICcxMCc6IFwib3Ryb3NcIlxuICAgICAgJzExJzogXCJpbXBsYW50ZVwiXG4gICAgICAnMTMnOiBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgJzE3JzogXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICAnZW4nOlxuICAgICAgJzEnOiBcInBpbGxcIlxuICAgICAgJzInOiBcIklVRFwiXG4gICAgICAnMyc6IFwiaW5qZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZG9tXCJcbiAgICAgICc2JzogXCJmZW1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICAnNyc6IFwibWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgICc4JzogXCJwZXJpb2RpYyBhYnN0aW5lbmNlXCJcbiAgICAgICc5JzogXCJ3aXRoZHJhd2FsXCJcbiAgICAgICcxMCc6IFwib3RoZXJcIlxuICAgICAgJzExJzogXCJpbXBsYW50XCJcbiAgICAgICcxMyc6IFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgJzE3JzogXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcblxuXG4gICMjI1xuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuICAjIyNcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgJ2VzJzpcbiAgICAgIFwiYVwiOiBcIm5vIGVzdMOhbiBjYXNhZGFzXCJcbiAgICAgIFwiYlwiOiBcIm5vIHRpZW5lbiBzZXhvXCJcbiAgICAgIFwiY1wiOiBcInRpZW5lbiBzZXhvIGluZnJlY3VlbnRlXCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs25cIlxuICAgICAgXCJlXCI6IFwic29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhc1wiXG4gICAgICBcImZcIjogXCJhbWVub3JyZWEgcG9zdHBhcnRvXCJcbiAgICAgIFwiZ1wiOiBcImVzdMOhbiBkYW5kbyBlbCBwZWNob1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGFcIlxuICAgICAgXCJpXCI6IFwibGEgbXVqZXIgc2Ugb3BvbmVcIlxuICAgICAgXCJqXCI6IFwiZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lXCJcbiAgICAgIFwia1wiOiBcIm90cm9zIHNlIG9wb25lblwiICAgICAgICBcbiAgICAgIFwibFwiOiBcInByb2hpYmljacOzbiByZWxpZ2lvc2FcIiAgXG4gICAgICBcIm1cIjogXCJubyBjb25vY2UgbG9zIG3DqXRvZG9zXCJcbiAgICAgIFwiblwiOiBcIm5vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvc1wiXG4gICAgICBcIm9cIjogXCJwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiICAgICAgICAgICAgICAgICAgICAgXG4gICAgICBcInBcIjogXCJtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zL3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgXG4gICAgICBcInFcIjogXCJmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zXCJcbiAgICAgIFwiclwiOiBcImN1ZXN0YW4gZGVtYXNpYWRvXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudGVzIHBhcmEgc3UgdXNvXCJcbiAgICAgIFwidFwiOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAgIFwidVwiOiBcImVsIG3DqXRvZG8gZWxlZ2lkbyBubyBlc3TDoSBkaXNwb25pYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIGhheSBtw6l0b2RvcyBkaXNwb25pYmxlc1wiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdHJvc1wiXG4gICAgICBcInpcIjogXCJubyBsbyBzw6lcIlxuICAgICdlbic6XG4gICAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgICBcImJcIjogXCJub3QgaGF2aW5nIHNleFwiXG4gICAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgICBcImVcIjogXCJzdWJmZWN1bmQvaW5mZWN1bmRcIlxuICAgICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0aWNcIlxuICAgICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCJcbiAgICAgIFwialwiOiBcImh1c2JhbmQvcGFydG5lciBvcHBvc2VkXCJcbiAgICAgIFwia1wiOiBcIm90aGVycyBvcHBvc2VkXCJcbiAgICAgIFwibFwiOiBcInJlbGlnaW91cyBwcm9oaWJpdGlvblwiXG4gICAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgICAgXCJuXCI6IFwia25vd3Mgbm8gc291cmNlXCJcbiAgICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnQgdG8gdXNlXCJcbiAgICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpIncyBwcm9jZXNzZXNcIlxuICAgICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIG1ldGhvZCBhdmFpbGFibGVcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgICAgXCJ6XCI6IFwiZG9uJ3Qga25vd1wiXG5cbiAgcmVhc29uc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICd2M2EwOGEnOiAnbm8gZXN0w6FuIGNhc2FkYXMnXG4gICAgICAndjNhMDhiJzogJ25vIHRpZW5lbiBzZXhvJ1xuICAgICAgJ3YzYTA4Yyc6ICd0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZSdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzbidcbiAgICAgICd2M2EwOGUnOiAnc29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhcydcbiAgICAgICd2M2EwOGYnOiAnYW1lbm9ycmVhIHBvc3RwYXJ0bydcbiAgICAgICd2M2EwOGcnOiAnZXN0w6FuIGRhbmRvIGVsIHBlY2hvJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGEnXG4gICAgICAndjNhMDhpJzogJ2xhIG11amVyIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4aic6ICdlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhrJzogJ290cm9zIHNlIG9wb25lbicgICAgICAgIFxuICAgICAgJ3YzYTA4bCc6ICdwcm9oaWJpY2nDs24gcmVsaWdpb3NhJ1xuICAgICAgJ3YzYTA4bSc6ICdubyBjb25vY2UgbG9zIG3DqXRvZG9zJ1xuICAgICAgJ3YzYTA4bic6ICdubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3MnXG4gICAgICAndjNhMDhvJzogJ3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkJ1xuICAgICAgJ3YzYTA4cCc6ICdtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zJ1xuICAgICAgJ3YzYTA4cSc6ICdmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zJ1xuICAgICAgJ3YzYTA4cic6ICdjdWVzdGFuIGRlbWFzaWFkbydcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c28nXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgJ2VuJzogXG4gICAgICAndjNhMDhhJzogJ25vdCBtYXJyaWVkJ1xuICAgICAgJ3YzYTA4Yic6ICdub3QgaGF2aW5nIHNleCdcbiAgICAgICd2M2EwOGMnOiAnaW5mcmVxdWVudCBzZXgnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzYWwvaHlzdGVyZWN0b215J1xuICAgICAgJ3YzYTA4ZSc6ICdzdWJmZWN1bmQvaW5mZWN1bmQnXG4gICAgICAndjNhMDhmJzogJ3Bvc3RwYXJ0dW0gYW1lbm9ycmhlaWMnXG4gICAgICAndjNhMDhnJzogJ2JyZWFzdGZlZWRpbmcnXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0aWMnXG4gICAgICAndjNhMDhpJzogJ3Jlc3BvbmRlbnQgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGonOiAnaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQnXG4gICAgICAndjNhMDhrJzogJ290aGVycyBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4bCc6ICdyZWxpZ2lvdXMgcHJvaGliaXRpb24nXG4gICAgICAndjNhMDhtJzogJ2tub3dzIG5vIG1ldGhvZCdcbiAgICAgICd2M2EwOG4nOiAna25vd3Mgbm8gc291cmNlJ1xuICAgICAgJ3YzYTA4byc6ICdoZWFsdGggY29uY2VybnMnXG4gICAgICAndjNhMDhwJzogJ2ZlYXIgb2Ygc2lkZSBlZmZlY3RzJ1xuICAgICAgJ3YzYTA4cSc6ICdsYWNrIG9mIGFjY2Vzcy90b28gZmFyJ1xuICAgICAgJ3YzYTA4cic6ICdjb3N0cyB0b28gbXVjaCdcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50IHRvIHVzZSdcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmVyZXMgd2l0aCB0aGUgYm9keSdzIHByb2Nlc3Nlc1wiXG5cblxuICBzZXRMb2NhdGlvbiA9IChsb2NhdGlvbiwgY291bnRyaWVzKSAtPlxuICAgIGlmIGxvY2F0aW9uXG4gICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gICMgTG9hZCBsb2NhdGlvblxuICBkMy5qc29uICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nLCAoZXJyb3IsIGxvY2F0aW9uKSAtPlxuICAgICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgIHNldExvY2F0aW9uIGxvY2F0aW9uLCBjb3VudHJpZXNcbiAgICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXVxuXG4pIGpRdWVyeVxuIl19
