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
        'ARG': '<a href="https://www.clarin.com/sociedad/campana-ley-aborto-comenzo-2005-proyecto-presento-veces_0_BJvdi0nPz.html" target="_blank">Unas cinco mil mujeres marcharon en febrero de 2018 frente al Congreso argentino para pedir la legalización del aborto.</a>',
        'AUS': '<a href="http://www.abc.net.au/news/health/2017-07-22/natural-methods-of-contraception-on-the-rise-in-australia/8683346" target="_blank">Muchos australianos están volviendo a utilizar métodos tradicionales de anticoncepción, según un estudio de Monash University.</a>',
        'BEL': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/" target="_blank">Bélgica donó 10 millones de euros para la campaña <i>She Decides</i>, lanzada por el Gobierno holandés para contrarrestar la retirada de fondos para planificación familiar de Trump.</a>',
        'BOL': '<a href="https://www.efe.com/efe/america/sociedad/la-vergüenza-y-el-estigma-de-pedir-preservativos-en-bolivia//20000013-3265652" target="_blank">Farmacias de Bolivia implementaron códigos secretos para pedir preservativos y evitar el estigma de comprar estos anticonceptivos.</a>',
        'COL': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html" target="_blank">El Gobierno chino ofrece la retirada gratuita de DIUs después de la política del hijo único.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures" target="_blank">El Salvador es el único país del mundo donde abortar está penado con cárcel.</a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html" target="_blank">El ayuntamiento de Helsinki proporciona anticonceptivos de manera gratuita a los jóvenes menores de 25 años.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops" target="_blank">El uso de las pastillas anticonceptivas se ha reducido en Francia desde 2010.</a>',
        'GMB': 'En Gambia, muchas mujeres utilizan un método tradicional que consiste en atar a la cintura una cuerda, una rama, o un papelito con o sin frases del Corán.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577" target="_blank">Un proyecto alemán facilita anticonceptivos de forma gratuita a mujeres de más de 20 años con ingresos bajos.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco" target="_blank">La religión influye en la educación sexual de los jóvenes guatemaltecos.</a>',
        'ISR': 'En los sectores judíos más ortodoxos, solo pueden usarse los anticonceptivos si el rabino da su permiso a la mujer.',
        'JPN': 'Japón, aunque se encuentra en el grupo de países con renta alta, es la excepción: las necesidades no cubiertas con anticonceptivos está al nivel de países con rentas bajas.',
        'PRK': 'El 95% de mujeres que utilizan anticonceptivos en Corea del Norte han elegido el DIU. Se trata del mayor porcentaje de uso a nivel mundial.',
        'NLD': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/" target="_blank">El gobierno holandés lanza el proyecto <i>She Decides</i> para contrarrestar la retirada de fondos para planificación familiar de Trump.</a>',
        'PER': '<a href="https://interactive.quipu-project.com/#/es/quipu/intro" target="_blank">En la época de los 90, durante el gobierno de Fujimori, más de 250.000 mujeres fueron esterilizadas sin su consentimiento.</a>',
        'PHL': '<a href="https://www.theguardian.com/global-development/2017/jul/10/how-bitter-herbs-and-botched-abortions-kill-three-women-a-day-in-the-philippines" target="_blank"> En un país donde el aborto del está prohibido, tres mujeres mueren al día por complicaciones derivadas de intervenciones ilegales.</a>',
        'POL': '<a href="https://www.amnesty.org/en/latest/news/2017/06/poland-emergency-contraception-restrictions-catastrophic-for-women-and-girls/" target="_blank">El Gobierno polaco da un paso atrás y se convierte en el único país de la Unión Europea donde la pastilla del día después está sujeta a prescripción.</a>',
        'SSD': '<a href="https://www.theguardian.com/global-development/2017/may/25/every-year-i-give-birth-war-driving-contraception-crisis-sudan-nuba-mountains" target="_blank">La guerra en Sudán está creando una crisis en el acceso a anticonceptivos.</a>',
        'ESP': '<a href="http://cadenaser.com/emisora/2017/09/19/radio_madrid/1505842932_131031.html" target="_blank">Madrid es la única comunidad que no financia anticonceptivos con sus fondos.</a>',
        'TUR': '<a href="http://www.bbc.com/news/world-europe-36413097" target="_blank">Erdogan declara que la planificación familiar no es para los musulmanes.</a>',
        'UGA': '<a href="https://www.newvision.co.ug/new_vision/news/1458882/uganda-facing-150-million-condom-shortfall" target="_blank">En 2017, el Ministerio de Salud de Uganda declaraba un desabastecimiento de 150 millones de preservativos masculinos.</a>',
        'GBR': '<a href=https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform" target="_blank">En Irlanda es ilegal abortar a no ser que haya un riesgo real de salud para la madre.</a>',
        'USA': '<a href="https://www.nytimes.com/2018/01/18/us/health-care-office-abortion-contraception.html" target="_blank">Trump da a los médicos libertad para negarse a realizar procedimientos en contra de sus creencias religiosas, como el aborto.</a>',
        'VEN': '<a href="http://www.bbc.com/mundo/noticias-america-latina-42635412" target="_blank">La escasez y el precio elevado de los anticonceptivos en Venezuela influye en el aumento de embarazos no deseados.</a>',
        'ZMB': '<a href="https://www.ideo.org/project/diva-centres" target="_blank">Un proyecto en Zambia  une la manicura y los anticonceptivos.</a>'
      },
      'en': {
        'ALB': 'Withdrawn is the most used contraceptive method by Albanian women. Furthermore, it is the second country where the opposition of the respondent, the partner or the religion to use contraceptive methods is the main barrier for using them when they are needed.',
        'ARG': '<a href="https://www.clarin.com/sociedad/campana-ley-aborto-comenzo-2005-proyecto-presento-veces_0_BJvdi0nPz.html" target="_blank">Approximately five thousand women marched in February 2018 in front of the Argentine Congress to demand the legalization of abortion. </a>',
        'AUS': '<a href="http://www.abc.net.au/news/health/2017-07-22/natural-methods-of-contraception-on-the-rise-in-australia/8683346" target="_blank">Natural methods of contraception on the rise in Australia, according to an investigation of Monash University. </a>',
        'BEL': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/" target="_blank">Belgium have donated 10 million euros to the <i>She Decides</i> proyect, launched by the Dutch government to boost contraception in developing countries. </a>',
        'BOL': '<a href="https://www.efe.com/efe/america/sociedad/la-vergüenza-y-el-estigma-de-pedir-preservativos-en-bolivia//20000013-3265652" target="_blank">Bolivia\'s pharmacies have developed a secret code to ask for condoms and therefore, to avoid stigma about buying them.</a>',
        'COL': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html" target="_blank">After one child policiy, outrage at China\'s offer to remove IUDs.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures" target="_blank">El Salvador is one of six countries where abortion is banned under any circumstances, and women who undergo it could face prison </a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html" target="_blank">Helsinki to offer year’s worth of contraceptive pills to under 25-year-olds.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops" target="_blank">French women opt for alternatives as Pill use drops.</a>',
        'GMB': 'In The Gambia, many women use a traditional method that involves tying a rope, a branch or a piece of paper around the waist with -or without- phrases from the Koran in it.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577" target="_blank">A trial scheme in Germany is helping women on low incomes to avoid sacrificing their contraception.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco" target="_blank">Religion has a major influence in sexual education of Guatemala young people.</a>',
        'ISR': 'In ultra orthodox judaism, contraceptive use is only permitted if the rabbi gives previous permission to the woman.',
        'JPN': 'Japan, even if it is part of the group of countries with high income, has unmet needs for contraception at the level of countries with low income.',
        'PRK': '95% of women who use contraceptive methods in North Korea have chosen to use IUDs. It is the highest percentage of use of this method worldwide.',
        'NLD': '<a href="http://www.dutchnews.nl/news/archives/2017/03/she-decides-foundation-brings-in-e181m-for-family-planning-campaign/" target="_blank">Dutch initiative brings in €181m for family planning campaign.</a>',
        'PER': '<a href="https://interactive.quipu-project.com/#/es/quipu/intro" target="_blank">In the 1990s, Alberto Fujimori, former president of Peru, launched a new family planning programme that resulted in the sterilisation of 272,028 women and 22,004 men in only 4 years.</a>',
        'PHL': '<a href="https://www.theguardian.com/global-development/2017/jul/10/how-bitter-herbs-and-botched-abortions-kill-three-women-a-day-in-the-philippines" target="_blank"> How bitter herbs and botched abortions kill three women a day in the Philippines.</a>',
        'POL': '<a href="https://www.amnesty.org/en/latest/news/2017/06/poland-emergency-contraception-restrictions-catastrophic-for-women-and-girls/" target="_blank">Polish Government takes a step back in the access to the "morning-after" pill and it becomes the only European country where women need a prescription for the use of this contraceptive method.</a>',
        'SSD': '<a href="https://www.theguardian.com/global-development/2017/may/25/every-year-i-give-birth-war-driving-contraception-crisis-sudan-nuba-mountains" target="_blank">\'Every year, I give birth\': why war is driving a contraception crisis in Sudan.</a>',
        'ESP': '<a href="http://cadenaser.com/emisora/2017/09/19/radio_madrid/1505842932_131031.html" target="_blank">Madrid is the only regional government that does not finance contraceptive methods with its funds.</a>',
        'TUR': '<a href="http://www.bbc.com/news/world-europe-36413097" target="_blank">Turkey\'s Erdogan warns Muslims against birth control.</a>',
        'UGA': '<a href="https://www.newvision.co.ug/new_vision/news/1458882/uganda-facing-150-million-condom-shortfall" target="_blank">In 2017, Uganda faced a 150 millions male condoms shortfall.</a>',
        'GBR': '<a href=https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform" target="_blank">Irish referendum on abortion reform to be held by end of May 2018</a>',
        'USA': '<a href="https://www.nytimes.com/2018/01/18/us/health-care-office-abortion-contraception.html" target="_blank">Trump gives health workers new religious liberty protections.</a>',
        'VEN': '<a href="http://www.bbc.com/mundo/noticias-america-latina-42635412" target="_blank">The shortage and high price of contraceptives in Venezuela influences the increase in unwanted pregnancies</a>',
        'ZMB': '<a href="https://www.ideo.org/project/diva-centres" target="_blank">In Zambia, a radical new approach to contraception is giving adolescent girls the information and services of contraception while doing the manicure.</a>'
      }
    };

    function ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, user_country, methods_keys, methods_names, methods_dhs_names, reasons_names, reasons_dhs_names, pym) {
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
      this.pym = pym;
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
            _this.$app.find('.contraceptives-app-filters').show();
            if (_this.pym) {
              return _this.pym.sendHeight();
            }
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
        this.setAppItemData(this.$app, use, method, method_value, unmetneeds, reason, reason_value, this.sentences[this.country_code]);
        if (this.pym) {
          return this.pym.sendHeight();
        }
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
              data.forEach(function(d) {
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * d.using_modern_method / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
              });
              if (_this.pym) {
                return _this.pym.sendHeight();
              }
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
    var baseurl, lang, methods_dhs_names, methods_keys, methods_names, pymChild, reasons_dhs_names, reasons_names, setLocation, userCountry;
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
    pymChild = new pym.Child();
    return d3.json('https://freegeoip.net/json/', function(error, location) {
      return d3.queue().defer(d3.csv, baseurl + '/data/contraceptives-use-countries.csv').defer(d3.csv, baseurl + '/data/unmet-needs.csv').defer(d3.csv, baseurl + '/data/contraceptives-reasons.csv').defer(d3.csv, baseurl + '/data/countries-gni-population-2016.csv').defer(d3.json, baseurl + '/data/map-world-110.json').await(function(error, data_use, data_unmetneeds, data_reasons, countries, map) {
        setLocation(location, countries);
        if ($('#contraceptives-app').length) {
          return new ContraceptivesApp(lang, data_use, data_unmetneeds, data_reasons, userCountry, methods_keys, methods_names[lang], methods_dhs_names[lang], reasons_names[lang], reasons_dhs_names[lang], pymChild);
        }
      });
    });
  })(jQuery);

}).call(this);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWNlcHRpdmVzLWFwcC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLXN0YXRpYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztnQ0FFWCxXQUFBLEdBQ0U7TUFBQSx5QkFBQSxFQUEyQixXQUEzQjtNQUNBLHlCQUFBLEVBQTJCLEtBRDNCO01BRUEseUJBQUEsRUFBMkIsV0FGM0I7TUFHQSx5QkFBQSxFQUEyQixRQUgzQjs7O2dDQUtGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FERjtNQUdBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FKRjtNQU1BLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FWRjtNQVlBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FiRjtNQWVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FoQkY7TUFrQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsTUFEUjtPQW5CRjtNQXFCQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsVUFBUjtRQUNBLE1BQUEsRUFBUSxNQURSO09BdEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0F6QkY7TUEyQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsU0FEUjtPQTVCRjtNQThCQSxLQUFBLEVBQ0U7UUFBQSxN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LENBQUMsS0FBSCxDQUFBLENBQ0UsQ0FBQyxLQURILENBQ1MsRUFBRSxDQUFDLEdBRFosRUFDa0IsT0FBQSxHQUFRLHdDQUQxQixDQUVFLENBQUMsS0FGSCxDQUVTLEVBQUUsQ0FBQyxHQUZaLEVBRWtCLE9BQUEsR0FBUSx1QkFGMUIsQ0FHRSxDQUFDLEtBSEgsQ0FHUyxFQUFFLENBQUMsR0FIWixFQUdrQixPQUFBLEdBQVEsa0NBSDFCLENBSUUsQ0FBQyxLQUpILENBSVMsRUFBRSxDQUFDLEdBSlosRUFJa0IsT0FBQSxHQUFRLHlDQUoxQixDQUtFLENBQUMsS0FMSCxDQUtTLEVBQUUsQ0FBQyxJQUxaLEVBS2tCLE9BQUEsR0FBUSwwQkFMMUIsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLGVBQWxCLEVBQW1DLFlBQW5DLEVBQWlELFNBQWpELEVBQTRELEdBQTVEO1FBQ0wsV0FBQSxDQUFZLFFBQVosRUFBc0IsU0FBdEI7UUFDQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2lCQUNFLElBQUksaUJBQUosQ0FBc0IsSUFBdEIsRUFBNEIsUUFBNUIsRUFBc0MsZUFBdEMsRUFBdUQsWUFBdkQsRUFBcUUsV0FBckUsRUFBa0YsWUFBbEYsRUFBZ0csYUFBYyxDQUFBLElBQUEsQ0FBOUcsRUFBcUgsaUJBQWtCLENBQUEsSUFBQSxDQUF2SSxFQUE4SSxhQUFjLENBQUEsSUFBQSxDQUE1SixFQUFtSyxpQkFBa0IsQ0FBQSxJQUFBLENBQXJMLEVBQTRMLFFBQTVMLEVBREY7O01BRkssQ0FOVDtJQUZxQyxDQUF2QztFQXhPRCxDQUFELENBQUEsQ0FxUEUsTUFyUEY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy1zdGF0aWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNBcHBcblxuICBmaWx0ZXJfa2V5czogXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0wJzogJ3Jlc2lkZW5jZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTEnOiAnYWdlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMic6ICdlZHVjYXRpb24nXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0zJzogJ3dlYWx0aCdcblxuICBkaHNfY291bnRyaWVzOlxuICAgICdBRkcnOlxuICAgICAgJ25hbWUnOiAnQUZJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE3J1xuICAgICdBTEInOlxuICAgICAgJ25hbWUnOiAnQUxJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdBUk0nOlxuICAgICAgJ25hbWUnOiAnQU1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdBR08nOlxuICAgICAgJ25hbWUnOiAnQU9JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdBWkUnOlxuICAgICAgJ25hbWUnOiAnQVpJUjUyRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCR0QnOlxuICAgICAgJ25hbWUnOiAnQkRJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdCRU4nOlxuICAgICAgJ25hbWUnOiAnQkpJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCT0wnOlxuICAgICAgJ25hbWUnOiAnQk9JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdCREknOlxuICAgICAgJ25hbWUnOiAnQlVJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdDT0QnOlxuICAgICAgJ25hbWUnOiAnQ0RJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdDT0cnOlxuICAgICAgJ25hbWUnOiAnQ0dJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDSVYnOlxuICAgICAgJ25hbWUnOiAnQ0lJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDTVInOlxuICAgICAgJ25hbWUnOiAnQ01JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdDT0wnOlxuICAgICAgJ25hbWUnOiAnQ09JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdET00nOlxuICAgICAgJ25hbWUnOiAnRFJJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdFR1knOlxuICAgICAgJ25hbWUnOiAnRUdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdFVEgnOlxuICAgICAgJ25hbWUnOiAnRVRJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdHSEEnOlxuICAgICAgJ25hbWUnOiAnR0hJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdHTUInOlxuICAgICAgJ25hbWUnOiAnR01JUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdHSU4nOlxuICAgICAgJ25hbWUnOiAnR05JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdHVE0nOlxuICAgICAgJ25hbWUnOiAnR1VJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdHVVknOlxuICAgICAgJ25hbWUnOiAnR1lJUjVJRFQnXG4gICAgICAneWVhcic6ICcyMDA5J1xuICAgICdITkQnOlxuICAgICAgJ25hbWUnOiAnSE5JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdIVEknOlxuICAgICAgJ25hbWUnOiAnSFRJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdJTkQnOlxuICAgICAgJ25hbWUnOiAnSUFJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdJRE4nOlxuICAgICAgJ25hbWUnOiAnSURJUjYzRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdKT1InOlxuICAgICAgJ25hbWUnOiAnSk9JUjZDRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdLRU4nOlxuICAgICAgJ25hbWUnOiAnS0VJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdLSE0nOlxuICAgICAgJ25hbWUnOiAnS0hJUjczRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdMQlInOlxuICAgICAgJ25hbWUnOiAnTEJJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdMU08nOlxuICAgICAgJ25hbWUnOiAnTFNJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdNQVInOlxuICAgICAgJ25hbWUnOiAnTUFJUjQzRFQnXG4gICAgICAneWVhcic6ICcyMDAzLTA0J1xuICAgICdNREcnOlxuICAgICAgJ25hbWUnOiAnTURJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdNTEknOlxuICAgICAgJ25hbWUnOiAnTUxJUjUzRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdNTVInOlxuICAgICAgJ25hbWUnOiAnTU1JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdNV0knOlxuICAgICAgJ25hbWUnOiAnTVdJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdNT1onOlxuICAgICAgJ25hbWUnOiAnTVpJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdOR0EnOlxuICAgICAgJ25hbWUnOiAnTkdJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdORVInOlxuICAgICAgJ25hbWUnOiAnTklJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdOQU0nOlxuICAgICAgJ25hbWUnOiAnTk1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdOUEwnOlxuICAgICAgJ25hbWUnOiAnTlBJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdQRVInOlxuICAgICAgJ25hbWUnOiAnUEVJUjZJRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdQSEwnOlxuICAgICAgJ25hbWUnOiAnUEhJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdQQUsnOlxuICAgICAgJ25hbWUnOiAnUEtJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdSV0EnOlxuICAgICAgJ25hbWUnOiAnUldJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdTTEUnOlxuICAgICAgJ25hbWUnOiAnU0xJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdTRU4nOlxuICAgICAgJ25hbWUnOiAnU05JUjZERFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdTVFAnOlxuICAgICAgJ25hbWUnOiAnU1RJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdTV1onOlxuICAgICAgJ25hbWUnOiAnU1pJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdUQ0QnOlxuICAgICAgJ25hbWUnOiAnVERJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdUR08nOlxuICAgICAgJ25hbWUnOiAnVEdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdUSksnOlxuICAgICAgJ25hbWUnOiAnVEpJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdUTFMnOlxuICAgICAgJ25hbWUnOiAnVExJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDA5LTEwJ1xuICAgICdUWkEnOlxuICAgICAgJ25hbWUnOiAnVFpJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdVR0EnOlxuICAgICAgJ25hbWUnOiAnVUdJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdaTUInOlxuICAgICAgJ25hbWUnOiAnWk1JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA3J1xuICAgICdaV0UnOlxuICAgICAgJ25hbWUnOiAnWldJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuXG4gIHNlbnRlbmNlczogXG4gICAgJ2VzJzpcbiAgICAgICdBTEInOiAnTGEgbWFyY2hhIGF0csOhcyBlcyBlbCBwcmltZXIgbcOpdG9kbyBhbnRpY29uY2VwdGl2byBkZSBBbGJhbmlhLiBBZGVtw6FzLCBzZSB0cmF0YSBkZWwgc2VndW5kbyBwYcOtcyBkb25kZSBleGlzdGUgbWF5b3Igb3Bvc2ljacOzbiBkZSBsYSBwcm9waWEgbXVqZXIsIGxhIHBhcmVqYSBvIGxhIHJlbGlnacOzbiBhIHRvbWFyIGFudGljb25jZXB0aXZvcy4nXG4gICAgICAnQVJHJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jbGFyaW4uY29tL3NvY2llZGFkL2NhbXBhbmEtbGV5LWFib3J0by1jb21lbnpvLTIwMDUtcHJveWVjdG8tcHJlc2VudG8tdmVjZXNfMF9CSnZkaTBuUHouaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPlVuYXMgY2luY28gbWlsIG11amVyZXMgbWFyY2hhcm9uIGVuIGZlYnJlcm8gZGUgMjAxOCBmcmVudGUgYWwgQ29uZ3Jlc28gYXJnZW50aW5vIHBhcmEgcGVkaXIgbGEgbGVnYWxpemFjacOzbiBkZWwgYWJvcnRvLjwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiIHRhcmdldD1cIl9ibGFua1wiPk11Y2hvcyBhdXN0cmFsaWFub3MgZXN0w6FuIHZvbHZpZW5kbyBhIHV0aWxpemFyIG3DqXRvZG9zIHRyYWRpY2lvbmFsZXMgZGUgYW50aWNvbmNlcGNpw7NuLCBzZWfDum4gdW4gZXN0dWRpbyBkZSBNb25hc2ggVW5pdmVyc2l0eS48L2E+J1xuICAgICAgJ0JFTCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QsOpbGdpY2EgZG9uw7MgMTAgbWlsbG9uZXMgZGUgZXVyb3MgcGFyYSBsYSBjYW1wYcOxYSA8aT5TaGUgRGVjaWRlczwvaT4sIGxhbnphZGEgcG9yIGVsIEdvYmllcm5vIGhvbGFuZMOpcyBwYXJhIGNvbnRyYXJyZXN0YXIgbGEgcmV0aXJhZGEgZGUgZm9uZG9zIHBhcmEgcGxhbmlmaWNhY2nDs24gZmFtaWxpYXIgZGUgVHJ1bXAuPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RmFybWFjaWFzIGRlIEJvbGl2aWEgaW1wbGVtZW50YXJvbiBjw7NkaWdvcyBzZWNyZXRvcyBwYXJhIHBlZGlyIHByZXNlcnZhdGl2b3MgeSBldml0YXIgZWwgZXN0aWdtYSBkZSBjb21wcmFyIGVzdG9zIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICAgJ0NPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxNy8wMS8wNy93b3JsZC9hc2lhL2FmdGVyLW9uZS1jaGlsZC1wb2xpY3ktb3V0cmFnZS1hdC1jaGluYXMtb2ZmZXItdG8tcmVtb3ZlLWl1ZHMuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPkVsIEdvYmllcm5vIGNoaW5vIG9mcmVjZSBsYSByZXRpcmFkYSBncmF0dWl0YSBkZSBESVVzIGRlc3B1w6lzIGRlIGxhIHBvbMOtdGljYSBkZWwgaGlqbyDDum5pY28uPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgU2FsdmFkb3IgZXMgZWwgw7puaWNvIHBhw61zIGRlbCBtdW5kbyBkb25kZSBhYm9ydGFyIGVzdMOhIHBlbmFkbyBjb24gY8OhcmNlbC48L2E+J1xuICAgICAgJ0ZJTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5oZWxzaW5raXRpbWVzLmZpL2ZpbmxhbmQvZmlubGFuZC9uZXdzL2RvbWVzdGljLzE1MjcxLWhlbHNpbmtpLXRvLW9mZmVyLXllYXItcy13b3J0aC1vZi1jb250cmFjZXB0aXZlLXBpbGxzLXRvLXVuZGVyLTI1LXllYXItb2xkcy5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgYXl1bnRhbWllbnRvIGRlIEhlbHNpbmtpIHByb3BvcmNpb25hIGFudGljb25jZXB0aXZvcyBkZSBtYW5lcmEgZ3JhdHVpdGEgYSBsb3MgasOzdmVuZXMgbWVub3JlcyBkZSAyNSBhw7Fvcy48L2E+J1xuICAgICAgJ0ZSQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY29ubmV4aW9uZnJhbmNlLmNvbS9GcmVuY2gtbmV3cy9GcmVuY2gtd29tZW4tb3B0LWZvci1hbHRlcm5hdGl2ZXMtYXMtUGlsbC11c2UtZHJvcHNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCB1c28gZGUgbGFzIHBhc3RpbGxhcyBhbnRpY29uY2VwdGl2YXMgc2UgaGEgcmVkdWNpZG8gZW4gRnJhbmNpYSBkZXNkZSAyMDEwLjwvYT4nXG4gICAgICAnR01CJzogJ0VuIEdhbWJpYSwgbXVjaGFzIG11amVyZXMgdXRpbGl6YW4gdW4gbcOpdG9kbyB0cmFkaWNpb25hbCBxdWUgY29uc2lzdGUgZW4gYXRhciBhIGxhIGNpbnR1cmEgdW5hIGN1ZXJkYSwgdW5hIHJhbWEsIG8gdW4gcGFwZWxpdG8gY29uIG8gc2luIGZyYXNlcyBkZWwgQ29yw6FuLidcbiAgICAgICdERVUnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHcuY29tL2VuL2ZyZWUtcHJlc2NyaWJlZC1jb250cmFjZXB0aW9uLWZvci1sb3ctZWFybmVycy9hLTM4MTYxNTc3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+VW4gcHJveWVjdG8gYWxlbcOhbiBmYWNpbGl0YSBhbnRpY29uY2VwdGl2b3MgZGUgZm9ybWEgZ3JhdHVpdGEgYSBtdWplcmVzIGRlIG3DoXMgZGUgMjAgYcOxb3MgY29uIGluZ3Jlc29zIGJham9zLjwvYT4nXG4gICAgICAnR1RNJzogJzxhIGhyZWY9XCJodHRwOi8vYnVmZi5seS8ydGFZd2NvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TGEgcmVsaWdpw7NuIGluZmx1eWUgZW4gbGEgZWR1Y2FjacOzbiBzZXh1YWwgZGUgbG9zIGrDs3ZlbmVzIGd1YXRlbWFsdGVjb3MuPC9hPidcbiAgICAgICdJU1InOiAnRW4gbG9zIHNlY3RvcmVzIGp1ZMOtb3MgbcOhcyBvcnRvZG94b3MsIHNvbG8gcHVlZGVuIHVzYXJzZSBsb3MgYW50aWNvbmNlcHRpdm9zIHNpIGVsIHJhYmlubyBkYSBzdSBwZXJtaXNvIGEgbGEgbXVqZXIuJ1xuICAgICAgJ0pQTic6ICdKYXDDs24sIGF1bnF1ZSBzZSBlbmN1ZW50cmEgZW4gZWwgZ3J1cG8gZGUgcGHDrXNlcyBjb24gcmVudGEgYWx0YSwgZXMgbGEgZXhjZXBjacOzbjogbGFzIG5lY2VzaWRhZGVzIG5vIGN1YmllcnRhcyBjb24gYW50aWNvbmNlcHRpdm9zIGVzdMOhIGFsIG5pdmVsIGRlIHBhw61zZXMgY29uIHJlbnRhcyBiYWphcy4nXG4gICAgICAnUFJLJzogJ0VsIDk1JSBkZSBtdWplcmVzIHF1ZSB1dGlsaXphbiBhbnRpY29uY2VwdGl2b3MgZW4gQ29yZWEgZGVsIE5vcnRlIGhhbiBlbGVnaWRvIGVsIERJVS4gU2UgdHJhdGEgZGVsIG1heW9yIHBvcmNlbnRhamUgZGUgdXNvIGEgbml2ZWwgbXVuZGlhbC4nXG4gICAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBnb2JpZXJubyBob2xhbmTDqXMgbGFuemEgZWwgcHJveWVjdG8gPGk+U2hlIERlY2lkZXM8L2k+IHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RW4gbGEgw6lwb2NhIGRlIGxvcyA5MCwgZHVyYW50ZSBlbCBnb2JpZXJubyBkZSBGdWppbW9yaSwgbcOhcyBkZSAyNTAuMDAwIG11amVyZXMgZnVlcm9uIGVzdGVyaWxpemFkYXMgc2luIHN1IGNvbnNlbnRpbWllbnRvLjwvYT4nXG4gICAgICAnUEhMJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvanVsLzEwL2hvdy1iaXR0ZXItaGVyYnMtYW5kLWJvdGNoZWQtYWJvcnRpb25zLWtpbGwtdGhyZWUtd29tZW4tYS1kYXktaW4tdGhlLXBoaWxpcHBpbmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+IEVuIHVuIHBhw61zIGRvbmRlIGVsIGFib3J0byBkZWwgZXN0w6EgcHJvaGliaWRvLCB0cmVzIG11amVyZXMgbXVlcmVuIGFsIGTDrWEgcG9yIGNvbXBsaWNhY2lvbmVzIGRlcml2YWRhcyBkZSBpbnRlcnZlbmNpb25lcyBpbGVnYWxlcy48L2E+J1xuICAgICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiIHRhcmdldD1cIl9ibGFua1wiPkVsIEdvYmllcm5vIHBvbGFjbyBkYSB1biBwYXNvIGF0csOhcyB5IHNlIGNvbnZpZXJ0ZSBlbiBlbCDDum5pY28gcGHDrXMgZGUgbGEgVW5pw7NuIEV1cm9wZWEgZG9uZGUgbGEgcGFzdGlsbGEgZGVsIGTDrWEgZGVzcHXDqXMgZXN0w6Egc3VqZXRhIGEgcHJlc2NyaXBjacOzbi48L2E+J1xuICAgICAgJ1NTRCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L21heS8yNS9ldmVyeS15ZWFyLWktZ2l2ZS1iaXJ0aC13YXItZHJpdmluZy1jb250cmFjZXB0aW9uLWNyaXNpcy1zdWRhbi1udWJhLW1vdW50YWluc1wiIHRhcmdldD1cIl9ibGFua1wiPkxhIGd1ZXJyYSBlbiBTdWTDoW4gZXN0w6EgY3JlYW5kbyB1bmEgY3Jpc2lzIGVuIGVsIGFjY2VzbyBhIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICAgJ0VTUCc6ICc8YSBocmVmPVwiaHR0cDovL2NhZGVuYXNlci5jb20vZW1pc29yYS8yMDE3LzA5LzE5L3JhZGlvX21hZHJpZC8xNTA1ODQyOTMyXzEzMTAzMS5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWFkcmlkIGVzIGxhIMO6bmljYSBjb211bmlkYWQgcXVlIG5vIGZpbmFuY2lhIGFudGljb25jZXB0aXZvcyBjb24gc3VzIGZvbmRvcy48L2E+J1xuICAgICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+RXJkb2dhbiBkZWNsYXJhIHF1ZSBsYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBubyBlcyBwYXJhIGxvcyBtdXN1bG1hbmVzLjwvYT4nXG4gICAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RW4gMjAxNywgZWwgTWluaXN0ZXJpbyBkZSBTYWx1ZCBkZSBVZ2FuZGEgZGVjbGFyYWJhIHVuIGRlc2FiYXN0ZWNpbWllbnRvIGRlIDE1MCBtaWxsb25lcyBkZSBwcmVzZXJ2YXRpdm9zIG1hc2N1bGlub3MuPC9hPidcbiAgICAgICdHQlInOiAnPGEgaHJlZj1odHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vd29ybGQvMjAxOC9qYW4vMjkvaXJlbGFuZC10by1ncmVlbmxpZ2h0LXJlZmVyZW5kdW0tb24tYWJvcnRpb24tbGF3LXJlZm9ybVwiIHRhcmdldD1cIl9ibGFua1wiPkVuIElybGFuZGEgZXMgaWxlZ2FsIGFib3J0YXIgYSBubyBzZXIgcXVlIGhheWEgdW4gcmllc2dvIHJlYWwgZGUgc2FsdWQgcGFyYSBsYSBtYWRyZS48L2E+J1xuICAgICAgJ1VTQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxOC8wMS8xOC91cy9oZWFsdGgtY2FyZS1vZmZpY2UtYWJvcnRpb24tY29udHJhY2VwdGlvbi5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VHJ1bXAgZGEgYSBsb3MgbcOpZGljb3MgbGliZXJ0YWQgcGFyYSBuZWdhcnNlIGEgcmVhbGl6YXIgcHJvY2VkaW1pZW50b3MgZW4gY29udHJhIGRlIHN1cyBjcmVlbmNpYXMgcmVsaWdpb3NhcywgY29tbyBlbCBhYm9ydG8uPC9hPidcbiAgICAgICdWRU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYmJjLmNvbS9tdW5kby9ub3RpY2lhcy1hbWVyaWNhLWxhdGluYS00MjYzNTQxMlwiIHRhcmdldD1cIl9ibGFua1wiPkxhIGVzY2FzZXogeSBlbCBwcmVjaW8gZWxldmFkbyBkZSBsb3MgYW50aWNvbmNlcHRpdm9zIGVuIFZlbmV6dWVsYSBpbmZsdXllIGVuIGVsIGF1bWVudG8gZGUgZW1iYXJhem9zIG5vIGRlc2VhZG9zLjwvYT4nXG4gICAgICAnWk1CJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5pZGVvLm9yZy9wcm9qZWN0L2RpdmEtY2VudHJlc1wiIHRhcmdldD1cIl9ibGFua1wiPlVuIHByb3llY3RvIGVuIFphbWJpYSAgdW5lIGxhIG1hbmljdXJhIHkgbG9zIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICdlbic6XG4gICAgICAnQUxCJzogJ1dpdGhkcmF3biBpcyB0aGUgbW9zdCB1c2VkIGNvbnRyYWNlcHRpdmUgbWV0aG9kIGJ5IEFsYmFuaWFuIHdvbWVuLiBGdXJ0aGVybW9yZSwgaXQgaXMgdGhlIHNlY29uZCBjb3VudHJ5IHdoZXJlIHRoZSBvcHBvc2l0aW9uIG9mIHRoZSByZXNwb25kZW50LCB0aGUgcGFydG5lciBvciB0aGUgcmVsaWdpb24gdG8gdXNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyBpcyB0aGUgbWFpbiBiYXJyaWVyIGZvciB1c2luZyB0aGVtIHdoZW4gdGhleSBhcmUgbmVlZGVkLidcbiAgICAgICdBUkcnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNsYXJpbi5jb20vc29jaWVkYWQvY2FtcGFuYS1sZXktYWJvcnRvLWNvbWVuem8tMjAwNS1wcm95ZWN0by1wcmVzZW50by12ZWNlc18wX0JKdmRpMG5Qei5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QXBwcm94aW1hdGVseSBmaXZlIHRob3VzYW5kIHdvbWVuIG1hcmNoZWQgaW4gRmVicnVhcnkgMjAxOCBpbiBmcm9udCBvZiB0aGUgQXJnZW50aW5lIENvbmdyZXNzIHRvIGRlbWFuZCB0aGUgbGVnYWxpemF0aW9uIG9mIGFib3J0aW9uLiA8L2E+J1xuICAgICAgJ0FVUyc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5hYmMubmV0LmF1L25ld3MvaGVhbHRoLzIwMTctMDctMjIvbmF0dXJhbC1tZXRob2RzLW9mLWNvbnRyYWNlcHRpb24tb24tdGhlLXJpc2UtaW4tYXVzdHJhbGlhLzg2ODMzNDZcIiB0YXJnZXQ9XCJfYmxhbmtcIj5OYXR1cmFsIG1ldGhvZHMgb2YgY29udHJhY2VwdGlvbiBvbiB0aGUgcmlzZSBpbiBBdXN0cmFsaWEsIGFjY29yZGluZyB0byBhbiBpbnZlc3RpZ2F0aW9uIG9mIE1vbmFzaCBVbml2ZXJzaXR5LiA8L2E+J1xuICAgICAgJ0JFTCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QmVsZ2l1bSBoYXZlIGRvbmF0ZWQgMTAgbWlsbGlvbiBldXJvcyB0byB0aGUgPGk+U2hlIERlY2lkZXM8L2k+IHByb3llY3QsIGxhdW5jaGVkIGJ5IHRoZSBEdXRjaCBnb3Zlcm5tZW50IHRvIGJvb3N0IGNvbnRyYWNlcHRpb24gaW4gZGV2ZWxvcGluZyBjb3VudHJpZXMuIDwvYT4nXG4gICAgICAnQk9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5lZmUuY29tL2VmZS9hbWVyaWNhL3NvY2llZGFkL2xhLXZlcmfDvGVuemEteS1lbC1lc3RpZ21hLWRlLXBlZGlyLXByZXNlcnZhdGl2b3MtZW4tYm9saXZpYS8vMjAwMDAwMTMtMzI2NTY1MlwiIHRhcmdldD1cIl9ibGFua1wiPkJvbGl2aWFcXCdzIHBoYXJtYWNpZXMgaGF2ZSBkZXZlbG9wZWQgYSBzZWNyZXQgY29kZSB0byBhc2sgZm9yIGNvbmRvbXMgYW5kIHRoZXJlZm9yZSwgdG8gYXZvaWQgc3RpZ21hIGFib3V0IGJ1eWluZyB0aGVtLjwvYT4nXG4gICAgICAnQ09MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QWZ0ZXIgb25lIGNoaWxkIHBvbGljaXksIG91dHJhZ2UgYXQgQ2hpbmFcXCdzIG9mZmVyIHRvIHJlbW92ZSBJVURzLjwvYT4nXG4gICAgICAnU0xWJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LXByb2Zlc3Npb25hbHMtbmV0d29yay9nYWxsZXJ5LzIwMTcvbWF5LzI2L3JlcHJvZHVjdGl2ZS1yaWdodHMtemlrYS13b21lbi1lbC1zYWx2YWRvci1pbi1waWN0dXJlc1wiIHRhcmdldD1cIl9ibGFua1wiPkVsIFNhbHZhZG9yIGlzIG9uZSBvZiBzaXggY291bnRyaWVzIHdoZXJlIGFib3J0aW9uIGlzIGJhbm5lZCB1bmRlciBhbnkgY2lyY3Vtc3RhbmNlcywgYW5kIHdvbWVuIHdobyB1bmRlcmdvIGl0IGNvdWxkIGZhY2UgcHJpc29uIDwvYT4nXG4gICAgICAnRklOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmhlbHNpbmtpdGltZXMuZmkvZmlubGFuZC9maW5sYW5kL25ld3MvZG9tZXN0aWMvMTUyNzEtaGVsc2lua2ktdG8tb2ZmZXIteWVhci1zLXdvcnRoLW9mLWNvbnRyYWNlcHRpdmUtcGlsbHMtdG8tdW5kZXItMjUteWVhci1vbGRzLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5IZWxzaW5raSB0byBvZmZlciB5ZWFy4oCZcyB3b3J0aCBvZiBjb250cmFjZXB0aXZlIHBpbGxzIHRvIHVuZGVyIDI1LXllYXItb2xkcy48L2E+J1xuICAgICAgJ0ZSQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY29ubmV4aW9uZnJhbmNlLmNvbS9GcmVuY2gtbmV3cy9GcmVuY2gtd29tZW4tb3B0LWZvci1hbHRlcm5hdGl2ZXMtYXMtUGlsbC11c2UtZHJvcHNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5GcmVuY2ggd29tZW4gb3B0IGZvciBhbHRlcm5hdGl2ZXMgYXMgUGlsbCB1c2UgZHJvcHMuPC9hPidcbiAgICAgICdHTUInOiAnSW4gVGhlIEdhbWJpYSwgbWFueSB3b21lbiB1c2UgYSB0cmFkaXRpb25hbCBtZXRob2QgdGhhdCBpbnZvbHZlcyB0eWluZyBhIHJvcGUsIGEgYnJhbmNoIG9yIGEgcGllY2Ugb2YgcGFwZXIgYXJvdW5kIHRoZSB3YWlzdCB3aXRoIC1vciB3aXRob3V0LSBwaHJhc2VzIGZyb20gdGhlIEtvcmFuIGluIGl0LidcbiAgICAgICdERVUnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHcuY29tL2VuL2ZyZWUtcHJlc2NyaWJlZC1jb250cmFjZXB0aW9uLWZvci1sb3ctZWFybmVycy9hLTM4MTYxNTc3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+QSB0cmlhbCBzY2hlbWUgaW4gR2VybWFueSBpcyBoZWxwaW5nIHdvbWVuIG9uIGxvdyBpbmNvbWVzIHRvIGF2b2lkIHNhY3JpZmljaW5nIHRoZWlyIGNvbnRyYWNlcHRpb24uPC9hPidcbiAgICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIiB0YXJnZXQ9XCJfYmxhbmtcIj5SZWxpZ2lvbiBoYXMgYSBtYWpvciBpbmZsdWVuY2UgaW4gc2V4dWFsIGVkdWNhdGlvbiBvZiBHdWF0ZW1hbGEgeW91bmcgcGVvcGxlLjwvYT4nXG4gICAgICAnSVNSJzogJ0luIHVsdHJhIG9ydGhvZG94IGp1ZGFpc20sIGNvbnRyYWNlcHRpdmUgdXNlIGlzIG9ubHkgcGVybWl0dGVkIGlmIHRoZSByYWJiaSBnaXZlcyBwcmV2aW91cyBwZXJtaXNzaW9uIHRvIHRoZSB3b21hbi4nXG4gICAgICAnSlBOJzogJ0phcGFuLCBldmVuIGlmIGl0IGlzIHBhcnQgb2YgdGhlIGdyb3VwIG9mIGNvdW50cmllcyB3aXRoIGhpZ2ggaW5jb21lLCBoYXMgdW5tZXQgbmVlZHMgZm9yIGNvbnRyYWNlcHRpb24gYXQgdGhlIGxldmVsIG9mIGNvdW50cmllcyB3aXRoIGxvdyBpbmNvbWUuJ1xuICAgICAgJ1BSSyc6ICc5NSUgb2Ygd29tZW4gd2hvIHVzZSBjb250cmFjZXB0aXZlIG1ldGhvZHMgaW4gTm9ydGggS29yZWEgaGF2ZSBjaG9zZW4gdG8gdXNlIElVRHMuIEl0IGlzIHRoZSBoaWdoZXN0IHBlcmNlbnRhZ2Ugb2YgdXNlIG9mIHRoaXMgbWV0aG9kIHdvcmxkd2lkZS4nXG4gICAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5EdXRjaCBpbml0aWF0aXZlIGJyaW5ncyBpbiDigqwxODFtIGZvciBmYW1pbHkgcGxhbm5pbmcgY2FtcGFpZ24uPC9hPidcbiAgICAgICdQRVInOiAnPGEgaHJlZj1cImh0dHBzOi8vaW50ZXJhY3RpdmUucXVpcHUtcHJvamVjdC5jb20vIy9lcy9xdWlwdS9pbnRyb1wiIHRhcmdldD1cIl9ibGFua1wiPkluIHRoZSAxOTkwcywgQWxiZXJ0byBGdWppbW9yaSwgZm9ybWVyIHByZXNpZGVudCBvZiBQZXJ1LCBsYXVuY2hlZCBhIG5ldyBmYW1pbHkgcGxhbm5pbmcgcHJvZ3JhbW1lIHRoYXQgcmVzdWx0ZWQgaW4gdGhlIHN0ZXJpbGlzYXRpb24gb2YgMjcyLDAyOCB3b21lbiBhbmQgMjIsMDA0IG1lbiBpbiBvbmx5IDQgeWVhcnMuPC9hPidcbiAgICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj4gSG93IGJpdHRlciBoZXJicyBhbmQgYm90Y2hlZCBhYm9ydGlvbnMga2lsbCB0aHJlZSB3b21lbiBhIGRheSBpbiB0aGUgUGhpbGlwcGluZXMuPC9hPidcbiAgICAgICdQT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmFtbmVzdHkub3JnL2VuL2xhdGVzdC9uZXdzLzIwMTcvMDYvcG9sYW5kLWVtZXJnZW5jeS1jb250cmFjZXB0aW9uLXJlc3RyaWN0aW9ucy1jYXRhc3Ryb3BoaWMtZm9yLXdvbWVuLWFuZC1naXJscy9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Qb2xpc2ggR292ZXJubWVudCB0YWtlcyBhIHN0ZXAgYmFjayBpbiB0aGUgYWNjZXNzIHRvIHRoZSBcIm1vcm5pbmctYWZ0ZXJcIiBwaWxsIGFuZCBpdCBiZWNvbWVzIHRoZSBvbmx5IEV1cm9wZWFuIGNvdW50cnkgd2hlcmUgd29tZW4gbmVlZCBhIHByZXNjcmlwdGlvbiBmb3IgdGhlIHVzZSBvZiB0aGlzIGNvbnRyYWNlcHRpdmUgbWV0aG9kLjwvYT4nXG4gICAgICAnU1NEJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvbWF5LzI1L2V2ZXJ5LXllYXItaS1naXZlLWJpcnRoLXdhci1kcml2aW5nLWNvbnRyYWNlcHRpb24tY3Jpc2lzLXN1ZGFuLW51YmEtbW91bnRhaW5zXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XFwnRXZlcnkgeWVhciwgSSBnaXZlIGJpcnRoXFwnOiB3aHkgd2FyIGlzIGRyaXZpbmcgYSBjb250cmFjZXB0aW9uIGNyaXNpcyBpbiBTdWRhbi48L2E+J1xuICAgICAgJ0VTUCc6ICc8YSBocmVmPVwiaHR0cDovL2NhZGVuYXNlci5jb20vZW1pc29yYS8yMDE3LzA5LzE5L3JhZGlvX21hZHJpZC8xNTA1ODQyOTMyXzEzMTAzMS5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWFkcmlkIGlzIHRoZSBvbmx5IHJlZ2lvbmFsIGdvdmVybm1lbnQgdGhhdCBkb2VzIG5vdCBmaW5hbmNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyB3aXRoIGl0cyBmdW5kcy48L2E+J1xuICAgICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+VHVya2V5XFwncyBFcmRvZ2FuIHdhcm5zIE11c2xpbXMgYWdhaW5zdCBiaXJ0aCBjb250cm9sLjwvYT4nXG4gICAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SW4gMjAxNywgVWdhbmRhIGZhY2VkIGEgMTUwIG1pbGxpb25zIG1hbGUgY29uZG9tcyBzaG9ydGZhbGwuPC9hPidcbiAgICAgICdHQlInOiAnPGEgaHJlZj1odHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vd29ybGQvMjAxOC9qYW4vMjkvaXJlbGFuZC10by1ncmVlbmxpZ2h0LXJlZmVyZW5kdW0tb24tYWJvcnRpb24tbGF3LXJlZm9ybVwiIHRhcmdldD1cIl9ibGFua1wiPklyaXNoIHJlZmVyZW5kdW0gb24gYWJvcnRpb24gcmVmb3JtIHRvIGJlIGhlbGQgYnkgZW5kIG9mIE1heSAyMDE4PC9hPidcbiAgICAgICdVU0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTgvMDEvMTgvdXMvaGVhbHRoLWNhcmUtb2ZmaWNlLWFib3J0aW9uLWNvbnRyYWNlcHRpb24uaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPlRydW1wIGdpdmVzIGhlYWx0aCB3b3JrZXJzIG5ldyByZWxpZ2lvdXMgbGliZXJ0eSBwcm90ZWN0aW9ucy48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VGhlIHNob3J0YWdlIGFuZCBoaWdoIHByaWNlIG9mIGNvbnRyYWNlcHRpdmVzIGluIFZlbmV6dWVsYSBpbmZsdWVuY2VzIHRoZSBpbmNyZWFzZSBpbiB1bndhbnRlZCBwcmVnbmFuY2llczwvYT4nXG4gICAgICAnWk1CJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5pZGVvLm9yZy9wcm9qZWN0L2RpdmEtY2VudHJlc1wiIHRhcmdldD1cIl9ibGFua1wiPkluIFphbWJpYSwgYSByYWRpY2FsIG5ldyBhcHByb2FjaCB0byBjb250cmFjZXB0aW9uIGlzIGdpdmluZyBhZG9sZXNjZW50IGdpcmxzIHRoZSBpbmZvcm1hdGlvbiBhbmQgc2VydmljZXMgb2YgY29udHJhY2VwdGlvbiB3aGlsZSBkb2luZyB0aGUgbWFuaWN1cmUuPC9hPidcblxuXG4gIGNvbnN0cnVjdG9yOiAobGFuZywgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyX2NvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lcywgbWV0aG9kc19kaHNfbmFtZXMsIHJlYXNvbnNfbmFtZXMsIHJlYXNvbnNfZGhzX25hbWVzLCBweW0pIC0+XG5cbiAgICBAc2VudGVuY2VzID0gQHNlbnRlbmNlc1tsYW5nXVxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQHB5bSA9IHB5bVxuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBAY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgIyBoaWRlIGZpbHRlcnMgJiBjbGVhciBhY3RpdmUgYnRuc1xuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLmhpZGUoKS5maW5kKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgIyBoaWRlIGZpbHRlcnMgcmVzdWx0c1xuICAgICQoJy5jb250cmFjZXB0aXZlcy1maWx0ZXInKS5oaWRlKClcblxuICAgIGlmIEBkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS55ZWFyXG4gICAgICAjIGxvYWQgY291bnRyeSBkaHMgZGF0YVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgZCA9IGRhdGFbMF1cbiAgICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgMTAwKmQudXNpbmdfbW9kZXJuX21ldGhvZC9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAgICMgc2hvdyBmaWx0ZXJzXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLnNob3coKVxuICAgICAgICAjIHVwZGF0ZSBpZnJhbWUgaGVpZ2h0XG4gICAgICAgIGlmIEBweW1cbiAgICAgICAgICBAcHltLnNlbmRIZWlnaHQoKVxuICAgIGVsc2VcbiAgICAgICMgc2V0IGRhdGEgeWVhclxuICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sICcyMDE1LTE2J1xuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVzZSBhbmQgY291bnRyeVVzZVswXVxuICAgICAgICBpZiBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddICE9ICcwJ1xuICAgICAgICAgIHVzZSAgICAgICAgICAgPSBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIG1ldGhvZCAgICAgICAgICA9IGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICBjb3VudHJ5VW5tZXRuZWVkcyA9IEBkYXRhLnVubWV0bmVlZHMuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVubWV0bmVlZHMgYW5kIGNvdW50cnlVbm1ldG5lZWRzWzBdXG4gICAgICAgICMgdXNlIHN1cnZleSBkYXRhIGlmIGF2YWlsYWJsZSwgdXNlIGVzdGltYXRlZCBpZiBub3RcbiAgICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXSBcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHVwZGF0ZSBpZnJhbWUgaGVpZ2h0XG4gICAgICBpZiBAcHltXG4gICAgICAgIEBweW0uc2VuZEhlaWdodCgpXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7c2Nyb2xsVG9wOiBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5vZmZzZXQoKS50b3AtMTV9LCA0MDBcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqZC51c2luZ19tb2Rlcm5fbWV0aG9kL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnNcbiAgICAgICAgICAjIFVwZGF0ZSBpZnJhbWUgaGVpZ2h0XG4gICAgICAgICAgaWYgQHB5bVxuICAgICAgICAgICAgQHB5bS5zZW5kSGVpZ2h0KClcblxuXG4gIHNldEFwcEl0ZW1EYXRhOiAoJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSwgc2VudGVuY2UpIC0+XG5cbiAgICAjY29uc29sZS5sb2cgJ3NldEFwcEl0ZW1EYXRhJywgJGVsLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZVxuXG4gICAgaWYgdXNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVzZScpLmh0bWwgTWF0aC5yb3VuZCgrdXNlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVzZScpLmhpZGUoKVxuXG4gICAgaWYgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kJykuaHRtbCBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QtdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK21ldGhvZF92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1tZXRob2QnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1tZXRob2QnKS5oaWRlKClcblxuICAgIGlmIHVubWV0bmVlZHNcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdW5tZXRuZWVkcycpLmh0bWwgTWF0aC5yb3VuZCgrdW5tZXRuZWVkcykrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLmhpZGUoKVxuXG4gICAgaWYgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbicpLmh0bWwgcmVhc29uXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXJlYXNvbi12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrcmVhc29uX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXJlYXNvbicpLmhpZGUoKVxuXG4gICAgaWYgc2VudGVuY2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaHRtbChzZW50ZW5jZSkuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtc2VudGVuY2UnKS5oaWRlKClcblxuIiwiIyBNYWluIHNjcmlwdCBmb3IgY29udHJhY2VwdGl2ZXMgYXJ0aWNsZXNcblxuKCgkKSAtPlxuICBcbiAgdXNlckNvdW50cnkgPSB7fVxuXG4gICMgR2V0IGN1cnJlbnQgYXJ0aWNsZSBsYW5nICYgYmFzZSB1cmxcbiAgbGFuZyAgICA9ICQoJ2JvZHknKS5kYXRhKCdsYW5nJylcbiAgYmFzZXVybCA9ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJylcblxuICAjY29uc29sZS5sb2cgJ2NvbnRyYWNlcHRpdmVzJywgbGFuZywgYmFzZXVybFxuXG4gICMgc2V0dXAgZm9ybWF0IG51bWJlcnNcbiAgaWYgbGFuZyA9PSAnZXMnXG4gICAgZDMuZm9ybWF0RGVmYXVsdExvY2FsZSB7XG4gICAgICBcImN1cnJlbmN5XCI6IFtcIiRcIixcIlwiXVxuICAgICAgXCJkZWNpbWFsXCI6IFwiLFwiXG4gICAgICBcInRob3VzYW5kc1wiOiBcIi5cIlxuICAgICAgXCJncm91cGluZ1wiOiBbM11cbiAgICB9XG5cbiAgbWV0aG9kc19rZXlzID0gW1xuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIklVRFwiXG4gICAgXCJJbXBsYW50XCJcbiAgICBcIkluamVjdGFibGVcIlxuICAgIFwiUGlsbFwiXG4gICAgXCJNYWxlIGNvbmRvbVwiXG4gICAgXCJGZW1hbGUgY29uZG9tXCJcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIlxuICBdXG5cbiAgbWV0aG9kc19uYW1lcyA9IFxuICAgICdlcyc6IFtcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgIFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICBcIkRJVVwiXG4gICAgICBcImltcGxhbnRlXCJcbiAgICAgIFwiaW55ZWN0YWJsZVwiXG4gICAgICBcInDDrWxkb3JhXCJcbiAgICAgIFwiY29uZMOzbiBtYXNjdWxpbm9cIlxuICAgICAgXCJjb25kw7NuIGZlbWVuaW5vXCJcbiAgICAgIFwibcOpdG9kb3MgZGUgYmFycmVyYSB2YWdpbmFsXCJcbiAgICAgIFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICBcImFudGljb25jZXB0aXZvcyBkZSBlbWVyZ2VuY2lhXCJcbiAgICAgIFwib3Ryb3MgbcOpdG9kb3MgbW9kZXJub3NcIlxuICAgICAgXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICBdXG4gICAgJ2VuJzogW1xuICAgICAgXCJmZW1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICBcIm1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICBcIklVRFwiXG4gICAgICBcImltcGxhbnRcIlxuICAgICAgXCJpbmplY3RhYmxlXCJcbiAgICAgIFwicGlsbFwiXG4gICAgICBcIm1hbGUgY29uZG9tXCJcbiAgICAgIFwiZmVtYWxlIGNvbmRvbVwiXG4gICAgICBcInZhZ2luYWwgYmFycmllciBtZXRob2RzXCJcbiAgICAgIFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgXCJlbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgICBcIm90aGVyIG1vZGVybiBtZXRob2RzXCJcbiAgICAgIFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG4gICAgXVxuXG4gIG1ldGhvZHNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAnMSc6IFwicMOtbGRvcmFcIlxuICAgICAgJzInOiBcIkRJVVwiXG4gICAgICAnMyc6IFwiaW55ZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZMOzblwiXG4gICAgICAnNic6IFwiZXN0ZXJpbGl6YWNpw7NuIGZlbWVuaW5hXCJcbiAgICAgICc3JzogXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgICc4JzogXCJhYnN0aW5lbmNpYSBwZXJpw7NkaWNhXCJcbiAgICAgICc5JzogXCJtYXJjaGEgYXRyw6FzXCJcbiAgICAgICcxMCc6IFwib3Ryb3NcIlxuICAgICAgJzExJzogXCJpbXBsYW50ZVwiXG4gICAgICAnMTMnOiBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgJzE3JzogXCJtw6l0b2RvcyB0cmFkaWNpb25hbGVzXCJcbiAgICAnZW4nOlxuICAgICAgJzEnOiBcInBpbGxcIlxuICAgICAgJzInOiBcIklVRFwiXG4gICAgICAnMyc6IFwiaW5qZWN0YWJsZVwiXG4gICAgICAnNSc6IFwiY29uZG9tXCJcbiAgICAgICc2JzogXCJmZW1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICAnNyc6IFwibWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgICc4JzogXCJwZXJpb2RpYyBhYnN0aW5lbmNlXCJcbiAgICAgICc5JzogXCJ3aXRoZHJhd2FsXCJcbiAgICAgICcxMCc6IFwib3RoZXJcIlxuICAgICAgJzExJzogXCJpbXBsYW50XCJcbiAgICAgICcxMyc6IFwibGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgICAgJzE3JzogXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcblxuXG4gICMjI1xuICBtZXRob2RzX2ljb25zID0gXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiOiAnc3RlcmlsaXphdGlvbidcbiAgICBcIklVRFwiOiAnZGl1J1xuICAgIFwiSW1wbGFudFwiOiBudWxsXG4gICAgXCJJbmplY3RhYmxlXCI6ICdpbmplY3RhYmxlJ1xuICAgIFwiUGlsbFwiOiAncGlsbCdcbiAgICBcIk1hbGUgY29uZG9tXCI6ICdjb25kb20nXG4gICAgXCJGZW1hbGUgY29uZG9tXCI6IG51bGxcbiAgICBcIlZhZ2luYWwgYmFycmllciBtZXRob2RzXCI6IG51bGxcbiAgICBcIkxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCI6IG51bGxcbiAgICBcIkVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCI6IG51bGxcbiAgICBcIk90aGVyIG1vZGVybiBtZXRob2RzXCI6IG51bGxcbiAgICBcIkFueSB0cmFkaXRpb25hbCBtZXRob2RcIjogJ3RyYWRpdGlvbmFsJ1xuICAjIyNcblxuICByZWFzb25zX25hbWVzID0gXG4gICAgJ2VzJzpcbiAgICAgIFwiYVwiOiBcIm5vIGVzdMOhbiBjYXNhZGFzXCJcbiAgICAgIFwiYlwiOiBcIm5vIHRpZW5lbiBzZXhvXCJcbiAgICAgIFwiY1wiOiBcInRpZW5lbiBzZXhvIGluZnJlY3VlbnRlXCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs25cIlxuICAgICAgXCJlXCI6IFwic29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhc1wiXG4gICAgICBcImZcIjogXCJhbWVub3JyZWEgcG9zdHBhcnRvXCJcbiAgICAgIFwiZ1wiOiBcImVzdMOhbiBkYW5kbyBlbCBwZWNob1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGFcIlxuICAgICAgXCJpXCI6IFwibGEgbXVqZXIgc2Ugb3BvbmVcIlxuICAgICAgXCJqXCI6IFwiZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lXCJcbiAgICAgIFwia1wiOiBcIm90cm9zIHNlIG9wb25lblwiICAgICAgICBcbiAgICAgIFwibFwiOiBcInByb2hpYmljacOzbiByZWxpZ2lvc2FcIiAgXG4gICAgICBcIm1cIjogXCJubyBjb25vY2UgbG9zIG3DqXRvZG9zXCJcbiAgICAgIFwiblwiOiBcIm5vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvc1wiXG4gICAgICBcIm9cIjogXCJwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiICAgICAgICAgICAgICAgICAgICAgXG4gICAgICBcInBcIjogXCJtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zL3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgXG4gICAgICBcInFcIjogXCJmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zXCJcbiAgICAgIFwiclwiOiBcImN1ZXN0YW4gZGVtYXNpYWRvXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudGVzIHBhcmEgc3UgdXNvXCJcbiAgICAgIFwidFwiOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAgIFwidVwiOiBcImVsIG3DqXRvZG8gZWxlZ2lkbyBubyBlc3TDoSBkaXNwb25pYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIGhheSBtw6l0b2RvcyBkaXNwb25pYmxlc1wiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdHJvc1wiXG4gICAgICBcInpcIjogXCJubyBsbyBzw6lcIlxuICAgICdlbic6XG4gICAgICBcImFcIjogXCJub3QgbWFycmllZFwiXG4gICAgICBcImJcIjogXCJub3QgaGF2aW5nIHNleFwiXG4gICAgICBcImNcIjogXCJpbmZyZXF1ZW50IHNleFwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2FsL2h5c3RlcmVjdG9teVwiXG4gICAgICBcImVcIjogXCJzdWJmZWN1bmQvaW5mZWN1bmRcIlxuICAgICAgXCJmXCI6IFwicG9zdHBhcnR1bSBhbWVub3JyaGVpY1wiXG4gICAgICBcImdcIjogXCJicmVhc3RmZWVkaW5nXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0aWNcIlxuICAgICAgXCJpXCI6IFwicmVzcG9uZGVudCBvcHBvc2VkXCJcbiAgICAgIFwialwiOiBcImh1c2JhbmQvcGFydG5lciBvcHBvc2VkXCJcbiAgICAgIFwia1wiOiBcIm90aGVycyBvcHBvc2VkXCJcbiAgICAgIFwibFwiOiBcInJlbGlnaW91cyBwcm9oaWJpdGlvblwiXG4gICAgICBcIm1cIjogXCJrbm93cyBubyBtZXRob2RcIlxuICAgICAgXCJuXCI6IFwia25vd3Mgbm8gc291cmNlXCJcbiAgICAgIFwib1wiOiBcImhlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInBcIjogXCJmZWFyIG9mIHNpZGUgZWZmZWN0cy9oZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJxXCI6IFwibGFjayBvZiBhY2Nlc3MvdG9vIGZhclwiXG4gICAgICBcInJcIjogXCJjb3N0cyB0b28gbXVjaFwiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnQgdG8gdXNlXCJcbiAgICAgIFwidFwiOiBcImludGVyZmVyZXMgd2l0aCBib2R5wpIncyBwcm9jZXNzZXNcIlxuICAgICAgXCJ1XCI6IFwicHJlZmVycmVkIG1ldGhvZCBub3QgYXZhaWxhYmxlXCJcbiAgICAgIFwidlwiOiBcIm5vIG1ldGhvZCBhdmFpbGFibGVcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3RoZXJcIlxuICAgICAgXCJ6XCI6IFwiZG9uJ3Qga25vd1wiXG5cbiAgcmVhc29uc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICd2M2EwOGEnOiAnbm8gZXN0w6FuIGNhc2FkYXMnXG4gICAgICAndjNhMDhiJzogJ25vIHRpZW5lbiBzZXhvJ1xuICAgICAgJ3YzYTA4Yyc6ICd0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZSdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzbidcbiAgICAgICd2M2EwOGUnOiAnc29uIHN1YmZlY3VuZGFzIG8gaW5mZWN1bmRhcydcbiAgICAgICd2M2EwOGYnOiAnYW1lbm9ycmVhIHBvc3RwYXJ0bydcbiAgICAgICd2M2EwOGcnOiAnZXN0w6FuIGRhbmRvIGVsIHBlY2hvJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGEnXG4gICAgICAndjNhMDhpJzogJ2xhIG11amVyIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4aic6ICdlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhrJzogJ290cm9zIHNlIG9wb25lbicgICAgICAgIFxuICAgICAgJ3YzYTA4bCc6ICdwcm9oaWJpY2nDs24gcmVsaWdpb3NhJ1xuICAgICAgJ3YzYTA4bSc6ICdubyBjb25vY2UgbG9zIG3DqXRvZG9zJ1xuICAgICAgJ3YzYTA4bic6ICdubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3MnXG4gICAgICAndjNhMDhvJzogJ3ByZW9jdXBhY2lvbmVzIGRlIHNhbHVkJ1xuICAgICAgJ3YzYTA4cCc6ICdtaWVkbyBhIGxvcyBlZmVjdG9zIHNlY3VuZGFyaW9zJ1xuICAgICAgJ3YzYTA4cSc6ICdmYWx0YSBkZSBhY2Nlc28vbXV5IGxlam9zJ1xuICAgICAgJ3YzYTA4cic6ICdjdWVzdGFuIGRlbWFzaWFkbydcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c28nXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgJ2VuJzogXG4gICAgICAndjNhMDhhJzogJ25vdCBtYXJyaWVkJ1xuICAgICAgJ3YzYTA4Yic6ICdub3QgaGF2aW5nIHNleCdcbiAgICAgICd2M2EwOGMnOiAnaW5mcmVxdWVudCBzZXgnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzYWwvaHlzdGVyZWN0b215J1xuICAgICAgJ3YzYTA4ZSc6ICdzdWJmZWN1bmQvaW5mZWN1bmQnXG4gICAgICAndjNhMDhmJzogJ3Bvc3RwYXJ0dW0gYW1lbm9ycmhlaWMnXG4gICAgICAndjNhMDhnJzogJ2JyZWFzdGZlZWRpbmcnXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0aWMnXG4gICAgICAndjNhMDhpJzogJ3Jlc3BvbmRlbnQgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGonOiAnaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWQnXG4gICAgICAndjNhMDhrJzogJ290aGVycyBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4bCc6ICdyZWxpZ2lvdXMgcHJvaGliaXRpb24nXG4gICAgICAndjNhMDhtJzogJ2tub3dzIG5vIG1ldGhvZCdcbiAgICAgICd2M2EwOG4nOiAna25vd3Mgbm8gc291cmNlJ1xuICAgICAgJ3YzYTA4byc6ICdoZWFsdGggY29uY2VybnMnXG4gICAgICAndjNhMDhwJzogJ2ZlYXIgb2Ygc2lkZSBlZmZlY3RzJ1xuICAgICAgJ3YzYTA4cSc6ICdsYWNrIG9mIGFjY2Vzcy90b28gZmFyJ1xuICAgICAgJ3YzYTA4cic6ICdjb3N0cyB0b28gbXVjaCdcbiAgICAgICd2M2EwOHMnOiAnaW5jb252ZW5pZW50IHRvIHVzZSdcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmVyZXMgd2l0aCB0aGUgYm9keSdzIHByb2Nlc3Nlc1wiXG5cblxuICBzZXRMb2NhdGlvbiA9IChsb2NhdGlvbiwgY291bnRyaWVzKSAtPlxuICAgIGlmIGxvY2F0aW9uXG4gICAgICB1c2VyX2NvdW50cnkgPSBjb3VudHJpZXMuZmlsdGVyIChkKSAtPiBkLmNvZGUyID09IGxvY2F0aW9uLmNvdW50cnlfY29kZVxuICAgICAgaWYgdXNlcl9jb3VudHJ5WzBdXG4gICAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSB1c2VyX2NvdW50cnlbMF0uY29kZVxuICAgICAgICB1c2VyQ291bnRyeS5uYW1lID0gdXNlcl9jb3VudHJ5WzBdWyduYW1lXycrbGFuZ11cbiAgICBlbHNlXG4gICAgICBsb2NhdGlvbiA9IHt9XG5cbiAgICB1bmxlc3MgbG9jYXRpb24uY29kZVxuICAgICAgdXNlckNvdW50cnkuY29kZSA9ICdFU1AnXG4gICAgICB1c2VyQ291bnRyeS5uYW1lID0gaWYgbGFuZyA9PSAnZXMnIHRoZW4gJ0VzcGHDsWEnIGVsc2UgJ1NwYWluJ1xuXG5cbiAgIyBTZXR1cFxuICAjIC0tLS0tLS0tLS0tLS0tLVxuXG4gIHB5bUNoaWxkID0gbmV3IHB5bS5DaGlsZCgpXG5cbiAgIyBMb2FkIGxvY2F0aW9uXG4gIGQzLmpzb24gJ2h0dHBzOi8vZnJlZWdlb2lwLm5ldC9qc29uLycsIChlcnJvciwgbG9jYXRpb24pIC0+XG4gICAgIyBMb2FkIGNzdnMgJiBzZXR1cCBtYXBzXG4gICAgZDMucXVldWUoKVxuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXVzZS1jb3VudHJpZXMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL3VubWV0LW5lZWRzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb3VudHJpZXMtZ25pLXBvcHVsYXRpb24tMjAxNi5jc3YnXG4gICAgICAuZGVmZXIgZDMuanNvbiwgYmFzZXVybCsnL2RhdGEvbWFwLXdvcmxkLTExMC5qc29uJ1xuICAgICAgLmF3YWl0IChlcnJvciwgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCBjb3VudHJpZXMsIG1hcCkgLT5cbiAgICAgICAgc2V0TG9jYXRpb24gbG9jYXRpb24sIGNvdW50cmllc1xuICAgICAgICBpZiAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJykubGVuZ3RoXG4gICAgICAgICAgbmV3IENvbnRyYWNlcHRpdmVzQXBwIGxhbmcsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlckNvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lc1tsYW5nXSwgbWV0aG9kc19kaHNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfbmFtZXNbbGFuZ10sIHJlYXNvbnNfZGhzX25hbWVzW2xhbmddLCBweW1DaGlsZFxuXG4pIGpRdWVyeVxuIl19
