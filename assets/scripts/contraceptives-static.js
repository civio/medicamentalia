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
        'CHN': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html" target="_blank">El Gobierno chino ofrece la retirada gratuita de DIUs después de la política del hijo único.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures" target="_blank">El Salvador es el único país del mundo donde abortar está penado con cárcel.</a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html" target="_blank">El ayuntamiento de Helsinki proporciona anticonceptivos de manera gratuita a los jóvenes menores de 25 años.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops" target="_blank">El uso de las pastillas anticonceptivas se ha reducido en Francia desde 2010.</a>',
        'GMB': 'En Gambia, muchas mujeres utilizan un método tradicional que consiste en atar a la cintura una cuerda, una rama, o un papelito con o sin frases del Corán.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577" target="_blank">Un proyecto alemán facilita anticonceptivos de forma gratuita a mujeres de más de 20 años con ingresos bajos.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco" target="_blank">La religión influye en la educación sexual de los jóvenes guatemaltecos.</a>',
        'IRL': '<a href="https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform" target="_blank">En Irlanda es ilegal abortar a no ser que haya un riesgo real de salud para la madre.</a>',
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
        'CHN': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html" target="_blank">After one child policiy, outrage at China\'s offer to remove IUDs.</a>',
        'SLV': '<a href="https://www.theguardian.com/global-development-professionals-network/gallery/2017/may/26/reproductive-rights-zika-women-el-salvador-in-pictures" target="_blank">El Salvador is one of six countries where abortion is banned under any circumstances, and women who undergo it could face prison </a>',
        'FIN': '<a href="http://www.helsinkitimes.fi/finland/finland/news/domestic/15271-helsinki-to-offer-year-s-worth-of-contraceptive-pills-to-under-25-year-olds.html" target="_blank">Helsinki to offer year’s worth of contraceptive pills to under 25-year-olds.</a>',
        'FRA': '<a href="https://www.connexionfrance.com/French-news/French-women-opt-for-alternatives-as-Pill-use-drops" target="_blank">French women opt for alternatives as Pill use drops.</a>',
        'GMB': 'In The Gambia, many women use a traditional method that involves tying a rope, a branch or a piece of paper around the waist with -or without- phrases from the Koran in it.',
        'DEU': '<a href="http://www.dw.com/en/free-prescribed-contraception-for-low-earners/a-38161577" target="_blank">A trial scheme in Germany is helping women on low incomes to avoid sacrificing their contraception.</a>',
        'GTM': '<a href="http://buff.ly/2taYwco" target="_blank">Religion has a major influence in sexual education of Guatemala young people.</a>',
        'IRL': '<a href="https://www.theguardian.com/world/2018/jan/29/ireland-to-greenlight-referendum-on-abortion-law-reform" target="_blank">Irish referendum on abortion reform to be held by end of May 2018</a>',
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
            _this.setAppItemData(_this.$app, 100 * (d.n - d.not_using_contraception) / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons, _this.sentences[_this.country_code]);
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
        console.log(countryUse);
        if (countryUse && countryUse[0]) {
          if (countryUse[0]['Any modern method'] !== '0') {
            use = parseFloat(countryUse[0]['Any modern method']) + parseFloat(countryUse[0]['Any traditional method']);
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
                return _this.setAppItemData(_this.filterEl.find('#' + _this.filter + '-' + d.id), 100 * (d.n - d.not_using_contraception) / d.n, _this.methodsDHSNames[d.most_popular_method], 100 * d.most_popular_method_n / d.n, 100 * d.with_unmet_needs / d.n, _this.reasonsDHSNames[d.most_popular_reason], 100 * d.most_popular_reason_n / d.n_reasons);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWNlcHRpdmVzLWFwcC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLXN0YXRpYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztnQ0FFWCxXQUFBLEdBQ0U7TUFBQSx5QkFBQSxFQUEyQixXQUEzQjtNQUNBLHlCQUFBLEVBQTJCLEtBRDNCO01BRUEseUJBQUEsRUFBMkIsV0FGM0I7TUFHQSx5QkFBQSxFQUEyQixRQUgzQjs7O2dDQUtGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FERjtNQUdBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FKRjtNQU1BLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FWRjtNQVlBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FiRjtNQWVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FoQkY7TUFrQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsTUFEUjtPQW5CRjtNQXFCQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsVUFBUjtRQUNBLE1BQUEsRUFBUSxNQURSO09BdEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0F6QkY7TUEyQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsU0FEUjtPQTVCRjtNQThCQSxLQUFBLEVBQ0U7UUFBQSxN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RjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLXN0YXRpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc0FwcFxuXG4gIGZpbHRlcl9rZXlzOiBcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTAnOiAncmVzaWRlbmNlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMSc6ICdhZ2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0yJzogJ2VkdWNhdGlvbidcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTMnOiAnd2VhbHRoJ1xuXG4gIGRoc19jb3VudHJpZXM6XG4gICAgJ0FGRyc6XG4gICAgICAnbmFtZSc6ICdBRklSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTcnXG4gICAgJ0FMQic6XG4gICAgICAnbmFtZSc6ICdBTElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ0FSTSc6XG4gICAgICAnbmFtZSc6ICdBTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0FHTyc6XG4gICAgICAnbmFtZSc6ICdBT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0FaRSc6XG4gICAgICAnbmFtZSc6ICdBWklSNTJEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JHRCc6XG4gICAgICAnbmFtZSc6ICdCRElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0JFTic6XG4gICAgICAnbmFtZSc6ICdCSklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JPTCc6XG4gICAgICAnbmFtZSc6ICdCT0lSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ0JESSc6XG4gICAgICAnbmFtZSc6ICdCVUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0NPRCc6XG4gICAgICAnbmFtZSc6ICdDRElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ0NPRyc6XG4gICAgICAnbmFtZSc6ICdDR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NJVic6XG4gICAgICAnbmFtZSc6ICdDSUlSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NNUic6XG4gICAgICAnbmFtZSc6ICdDTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ0NPTCc6XG4gICAgICAnbmFtZSc6ICdDT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0RPTSc6XG4gICAgICAnbmFtZSc6ICdEUklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0VHWSc6XG4gICAgICAnbmFtZSc6ICdFR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0VUSCc6XG4gICAgICAnbmFtZSc6ICdFVElSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ0dIQSc6XG4gICAgICAnbmFtZSc6ICdHSElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0dNQic6XG4gICAgICAnbmFtZSc6ICdHTUlSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0dJTic6XG4gICAgICAnbmFtZSc6ICdHTklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0dUTSc6XG4gICAgICAnbmFtZSc6ICdHVUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ0dVWSc6XG4gICAgICAnbmFtZSc6ICdHWUlSNUlEVCdcbiAgICAgICd5ZWFyJzogJzIwMDknXG4gICAgJ0hORCc6XG4gICAgICAnbmFtZSc6ICdITklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0hUSSc6XG4gICAgICAnbmFtZSc6ICdIVElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0lORCc6XG4gICAgICAnbmFtZSc6ICdJQUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ0lETic6XG4gICAgICAnbmFtZSc6ICdJRElSNjNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0pPUic6XG4gICAgICAnbmFtZSc6ICdKT0lSNkNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0tFTic6XG4gICAgICAnbmFtZSc6ICdLRUlSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0tITSc6XG4gICAgICAnbmFtZSc6ICdLSElSNzNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0xCUic6XG4gICAgICAnbmFtZSc6ICdMQklSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0xTTyc6XG4gICAgICAnbmFtZSc6ICdMU0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ01BUic6XG4gICAgICAnbmFtZSc6ICdNQUlSNDNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDMtMDQnXG4gICAgJ01ERyc6XG4gICAgICAnbmFtZSc6ICdNRElSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ01MSSc6XG4gICAgICAnbmFtZSc6ICdNTElSNTNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ01NUic6XG4gICAgICAnbmFtZSc6ICdNTUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ01XSSc6XG4gICAgICAnbmFtZSc6ICdNV0lSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ01PWic6XG4gICAgICAnbmFtZSc6ICdNWklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ05HQSc6XG4gICAgICAnbmFtZSc6ICdOR0lSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05FUic6XG4gICAgICAnbmFtZSc6ICdOSUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ05BTSc6XG4gICAgICAnbmFtZSc6ICdOTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05QTCc6XG4gICAgICAnbmFtZSc6ICdOUElSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ1BFUic6XG4gICAgICAnbmFtZSc6ICdQRUlSNklEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1BITCc6XG4gICAgICAnbmFtZSc6ICdQSElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1BBSyc6XG4gICAgICAnbmFtZSc6ICdQS0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1JXQSc6XG4gICAgICAnbmFtZSc6ICdSV0lSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ1NMRSc6XG4gICAgICAnbmFtZSc6ICdTTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1NFTic6XG4gICAgICAnbmFtZSc6ICdTTklSNkREVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1NUUCc6XG4gICAgICAnbmFtZSc6ICdTVElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ1NXWic6XG4gICAgICAnbmFtZSc6ICdTWklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ1RDRCc6XG4gICAgICAnbmFtZSc6ICdURElSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ1RHTyc6XG4gICAgICAnbmFtZSc6ICdUR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ1RKSyc6XG4gICAgICAnbmFtZSc6ICdUSklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1RMUyc6XG4gICAgICAnbmFtZSc6ICdUTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDktMTAnXG4gICAgJ1RaQSc6XG4gICAgICAnbmFtZSc6ICdUWklSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ1VHQSc6XG4gICAgICAnbmFtZSc6ICdVR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ1pNQic6XG4gICAgICAnbmFtZSc6ICdaTUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDcnXG4gICAgJ1pXRSc6XG4gICAgICAnbmFtZSc6ICdaV0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG5cbiAgc2VudGVuY2VzOiBcbiAgICAnZXMnOlxuICAgICAgJ0FMQic6ICdMYSBtYXJjaGEgYXRyw6FzIGVzIGVsIHByaW1lciBtw6l0b2RvIGFudGljb25jZXB0aXZvIGRlIEFsYmFuaWEuIEFkZW3DoXMsIHNlIHRyYXRhIGRlbCBzZWd1bmRvIHBhw61zIGRvbmRlIGV4aXN0ZSBtYXlvciBvcG9zaWNpw7NuIGRlIGxhIHByb3BpYSBtdWplciwgbGEgcGFyZWphIG8gbGEgcmVsaWdpw7NuIGEgdG9tYXIgYW50aWNvbmNlcHRpdm9zLidcbiAgICAgICdBUkcnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNsYXJpbi5jb20vc29jaWVkYWQvY2FtcGFuYS1sZXktYWJvcnRvLWNvbWVuem8tMjAwNS1wcm95ZWN0by1wcmVzZW50by12ZWNlc18wX0JKdmRpMG5Qei5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VW5hcyBjaW5jbyBtaWwgbXVqZXJlcyBtYXJjaGFyb24gZW4gZmVicmVybyBkZSAyMDE4IGZyZW50ZSBhbCBDb25ncmVzbyBhcmdlbnRpbm8gcGFyYSBwZWRpciBsYSBsZWdhbGl6YWNpw7NuIGRlbCBhYm9ydG8uPC9hPidcbiAgICAgICdBVVMnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYWJjLm5ldC5hdS9uZXdzL2hlYWx0aC8yMDE3LTA3LTIyL25hdHVyYWwtbWV0aG9kcy1vZi1jb250cmFjZXB0aW9uLW9uLXRoZS1yaXNlLWluLWF1c3RyYWxpYS84NjgzMzQ2XCIgdGFyZ2V0PVwiX2JsYW5rXCI+TXVjaG9zIGF1c3RyYWxpYW5vcyBlc3TDoW4gdm9sdmllbmRvIGEgdXRpbGl6YXIgbcOpdG9kb3MgdHJhZGljaW9uYWxlcyBkZSBhbnRpY29uY2VwY2nDs24sIHNlZ8O6biB1biBlc3R1ZGlvIGRlIE1vbmFzaCBVbml2ZXJzaXR5LjwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Cw6lsZ2ljYSBkb27DsyAxMCBtaWxsb25lcyBkZSBldXJvcyBwYXJhIGxhIGNhbXBhw7FhIDxpPlNoZSBEZWNpZGVzPC9pPiwgbGFuemFkYSBwb3IgZWwgR29iaWVybm8gaG9sYW5kw6lzIHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ0JPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZWZlLmNvbS9lZmUvYW1lcmljYS9zb2NpZWRhZC9sYS12ZXJnw7xlbnphLXktZWwtZXN0aWdtYS1kZS1wZWRpci1wcmVzZXJ2YXRpdm9zLWVuLWJvbGl2aWEvLzIwMDAwMDEzLTMyNjU2NTJcIiB0YXJnZXQ9XCJfYmxhbmtcIj5GYXJtYWNpYXMgZGUgQm9saXZpYSBpbXBsZW1lbnRhcm9uIGPDs2RpZ29zIHNlY3JldG9zIHBhcmEgcGVkaXIgcHJlc2VydmF0aXZvcyB5IGV2aXRhciBlbCBlc3RpZ21hIGRlIGNvbXByYXIgZXN0b3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnQ0hOJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgR29iaWVybm8gY2hpbm8gb2ZyZWNlIGxhIHJldGlyYWRhIGdyYXR1aXRhIGRlIERJVXMgZGVzcHXDqXMgZGUgbGEgcG9sw610aWNhIGRlbCBoaWpvIMO6bmljby48L2E+J1xuICAgICAgJ1NMVic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC1wcm9mZXNzaW9uYWxzLW5ldHdvcmsvZ2FsbGVyeS8yMDE3L21heS8yNi9yZXByb2R1Y3RpdmUtcmlnaHRzLXppa2Etd29tZW4tZWwtc2FsdmFkb3ItaW4tcGljdHVyZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBTYWx2YWRvciBlcyBlbCDDum5pY28gcGHDrXMgZGVsIG11bmRvIGRvbmRlIGFib3J0YXIgZXN0w6EgcGVuYWRvIGNvbiBjw6FyY2VsLjwvYT4nXG4gICAgICAnRklOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmhlbHNpbmtpdGltZXMuZmkvZmlubGFuZC9maW5sYW5kL25ld3MvZG9tZXN0aWMvMTUyNzEtaGVsc2lua2ktdG8tb2ZmZXIteWVhci1zLXdvcnRoLW9mLWNvbnRyYWNlcHRpdmUtcGlsbHMtdG8tdW5kZXItMjUteWVhci1vbGRzLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBheXVudGFtaWVudG8gZGUgSGVsc2lua2kgcHJvcG9yY2lvbmEgYW50aWNvbmNlcHRpdm9zIGRlIG1hbmVyYSBncmF0dWl0YSBhIGxvcyBqw7N2ZW5lcyBtZW5vcmVzIGRlIDI1IGHDsW9zLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiIHRhcmdldD1cIl9ibGFua1wiPkVsIHVzbyBkZSBsYXMgcGFzdGlsbGFzIGFudGljb25jZXB0aXZhcyBzZSBoYSByZWR1Y2lkbyBlbiBGcmFuY2lhIGRlc2RlIDIwMTAuPC9hPidcbiAgICAgICdHTUInOiAnRW4gR2FtYmlhLCBtdWNoYXMgbXVqZXJlcyB1dGlsaXphbiB1biBtw6l0b2RvIHRyYWRpY2lvbmFsIHF1ZSBjb25zaXN0ZSBlbiBhdGFyIGEgbGEgY2ludHVyYSB1bmEgY3VlcmRhLCB1bmEgcmFtYSwgbyB1biBwYXBlbGl0byBjb24gbyBzaW4gZnJhc2VzIGRlbCBDb3LDoW4uJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5VbiBwcm95ZWN0byBhbGVtw6FuIGZhY2lsaXRhIGFudGljb25jZXB0aXZvcyBkZSBmb3JtYSBncmF0dWl0YSBhIG11amVyZXMgZGUgbcOhcyBkZSAyMCBhw7FvcyBjb24gaW5ncmVzb3MgYmFqb3MuPC9hPidcbiAgICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIiB0YXJnZXQ9XCJfYmxhbmtcIj5MYSByZWxpZ2nDs24gaW5mbHV5ZSBlbiBsYSBlZHVjYWNpw7NuIHNleHVhbCBkZSBsb3MgasOzdmVuZXMgZ3VhdGVtYWx0ZWNvcy48L2E+J1xuICAgICAgJ0lSTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL3dvcmxkLzIwMTgvamFuLzI5L2lyZWxhbmQtdG8tZ3JlZW5saWdodC1yZWZlcmVuZHVtLW9uLWFib3J0aW9uLWxhdy1yZWZvcm1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbiBJcmxhbmRhIGVzIGlsZWdhbCBhYm9ydGFyIGEgbm8gc2VyIHF1ZSBoYXlhIHVuIHJpZXNnbyByZWFsIGRlIHNhbHVkIHBhcmEgbGEgbWFkcmUuPC9hPidcbiAgICAgICdJU1InOiAnRW4gbG9zIHNlY3RvcmVzIGp1ZMOtb3MgbcOhcyBvcnRvZG94b3MsIHNvbG8gcHVlZGVuIHVzYXJzZSBsb3MgYW50aWNvbmNlcHRpdm9zIHNpIGVsIHJhYmlubyBkYSBzdSBwZXJtaXNvIGEgbGEgbXVqZXIuJ1xuICAgICAgJ0pQTic6ICdKYXDDs24sIGF1bnF1ZSBzZSBlbmN1ZW50cmEgZW4gZWwgZ3J1cG8gZGUgcGHDrXNlcyBjb24gcmVudGEgYWx0YSwgZXMgbGEgZXhjZXBjacOzbjogbGFzIG5lY2VzaWRhZGVzIG5vIGN1YmllcnRhcyBjb24gYW50aWNvbmNlcHRpdm9zIGVzdMOhIGFsIG5pdmVsIGRlIHBhw61zZXMgY29uIHJlbnRhcyBiYWphcy4nXG4gICAgICAnUFJLJzogJ0VsIDk1JSBkZSBtdWplcmVzIHF1ZSB1dGlsaXphbiBhbnRpY29uY2VwdGl2b3MgZW4gQ29yZWEgZGVsIE5vcnRlIGhhbiBlbGVnaWRvIGVsIERJVS4gU2UgdHJhdGEgZGVsIG1heW9yIHBvcmNlbnRhamUgZGUgdXNvIGEgbml2ZWwgbXVuZGlhbC4nXG4gICAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBnb2JpZXJubyBob2xhbmTDqXMgbGFuemEgZWwgcHJveWVjdG8gPGk+U2hlIERlY2lkZXM8L2k+IHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RW4gbGEgw6lwb2NhIGRlIGxvcyA5MCwgZHVyYW50ZSBlbCBnb2JpZXJubyBkZSBGdWppbW9yaSwgbcOhcyBkZSAyNTAuMDAwIG11amVyZXMgZnVlcm9uIGVzdGVyaWxpemFkYXMgc2luIHN1IGNvbnNlbnRpbWllbnRvLjwvYT4nXG4gICAgICAnUEhMJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvanVsLzEwL2hvdy1iaXR0ZXItaGVyYnMtYW5kLWJvdGNoZWQtYWJvcnRpb25zLWtpbGwtdGhyZWUtd29tZW4tYS1kYXktaW4tdGhlLXBoaWxpcHBpbmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+IEVuIHVuIHBhw61zIGRvbmRlIGVsIGFib3J0byBkZWwgZXN0w6EgcHJvaGliaWRvLCB0cmVzIG11amVyZXMgbXVlcmVuIGFsIGTDrWEgcG9yIGNvbXBsaWNhY2lvbmVzIGRlcml2YWRhcyBkZSBpbnRlcnZlbmNpb25lcyBpbGVnYWxlcy48L2E+J1xuICAgICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiIHRhcmdldD1cIl9ibGFua1wiPkVsIEdvYmllcm5vIHBvbGFjbyBkYSB1biBwYXNvIGF0csOhcyB5IHNlIGNvbnZpZXJ0ZSBlbiBlbCDDum5pY28gcGHDrXMgZGUgbGEgVW5pw7NuIEV1cm9wZWEgZG9uZGUgbGEgcGFzdGlsbGEgZGVsIGTDrWEgZGVzcHXDqXMgZXN0w6Egc3VqZXRhIGEgcHJlc2NyaXBjacOzbi48L2E+J1xuICAgICAgJ1NTRCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L21heS8yNS9ldmVyeS15ZWFyLWktZ2l2ZS1iaXJ0aC13YXItZHJpdmluZy1jb250cmFjZXB0aW9uLWNyaXNpcy1zdWRhbi1udWJhLW1vdW50YWluc1wiIHRhcmdldD1cIl9ibGFua1wiPkxhIGd1ZXJyYSBlbiBTdWTDoW4gZXN0w6EgY3JlYW5kbyB1bmEgY3Jpc2lzIGVuIGVsIGFjY2VzbyBhIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICAgJ0VTUCc6ICc8YSBocmVmPVwiaHR0cDovL2NhZGVuYXNlci5jb20vZW1pc29yYS8yMDE3LzA5LzE5L3JhZGlvX21hZHJpZC8xNTA1ODQyOTMyXzEzMTAzMS5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWFkcmlkIGVzIGxhIMO6bmljYSBjb211bmlkYWQgcXVlIG5vIGZpbmFuY2lhIGFudGljb25jZXB0aXZvcyBjb24gc3VzIGZvbmRvcy48L2E+J1xuICAgICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+RXJkb2dhbiBkZWNsYXJhIHF1ZSBsYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBubyBlcyBwYXJhIGxvcyBtdXN1bG1hbmVzLjwvYT4nXG4gICAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RW4gMjAxNywgZWwgTWluaXN0ZXJpbyBkZSBTYWx1ZCBkZSBVZ2FuZGEgZGVjbGFyYWJhIHVuIGRlc2FiYXN0ZWNpbWllbnRvIGRlIDE1MCBtaWxsb25lcyBkZSBwcmVzZXJ2YXRpdm9zIG1hc2N1bGlub3MuPC9hPidcbiAgICAgICdVU0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTgvMDEvMTgvdXMvaGVhbHRoLWNhcmUtb2ZmaWNlLWFib3J0aW9uLWNvbnRyYWNlcHRpb24uaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPlRydW1wIGRhIGEgbG9zIG3DqWRpY29zIGxpYmVydGFkIHBhcmEgbmVnYXJzZSBhIHJlYWxpemFyIHByb2NlZGltaWVudG9zIGVuIGNvbnRyYSBkZSBzdXMgY3JlZW5jaWFzIHJlbGlnaW9zYXMsIGNvbW8gZWwgYWJvcnRvLjwvYT4nXG4gICAgICAnVkVOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbXVuZG8vbm90aWNpYXMtYW1lcmljYS1sYXRpbmEtNDI2MzU0MTJcIiB0YXJnZXQ9XCJfYmxhbmtcIj5MYSBlc2Nhc2V6IHkgZWwgcHJlY2lvIGVsZXZhZG8gZGUgbG9zIGFudGljb25jZXB0aXZvcyBlbiBWZW5lenVlbGEgaW5mbHV5ZSBlbiBlbCBhdW1lbnRvIGRlIGVtYmFyYXpvcyBubyBkZXNlYWRvcy48L2E+J1xuICAgICAgJ1pNQic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuaWRlby5vcmcvcHJvamVjdC9kaXZhLWNlbnRyZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5VbiBwcm95ZWN0byBlbiBaYW1iaWEgIHVuZSBsYSBtYW5pY3VyYSB5IGxvcyBhbnRpY29uY2VwdGl2b3MuPC9hPidcbiAgICAnZW4nOlxuICAgICAgJ0FMQic6ICdXaXRoZHJhd24gaXMgdGhlIG1vc3QgdXNlZCBjb250cmFjZXB0aXZlIG1ldGhvZCBieSBBbGJhbmlhbiB3b21lbi4gRnVydGhlcm1vcmUsIGl0IGlzIHRoZSBzZWNvbmQgY291bnRyeSB3aGVyZSB0aGUgb3Bwb3NpdGlvbiBvZiB0aGUgcmVzcG9uZGVudCwgdGhlIHBhcnRuZXIgb3IgdGhlIHJlbGlnaW9uIHRvIHVzZSBjb250cmFjZXB0aXZlIG1ldGhvZHMgaXMgdGhlIG1haW4gYmFycmllciBmb3IgdXNpbmcgdGhlbSB3aGVuIHRoZXkgYXJlIG5lZWRlZC4nXG4gICAgICAnQVJHJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jbGFyaW4uY29tL3NvY2llZGFkL2NhbXBhbmEtbGV5LWFib3J0by1jb21lbnpvLTIwMDUtcHJveWVjdG8tcHJlc2VudG8tdmVjZXNfMF9CSnZkaTBuUHouaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPkFwcHJveGltYXRlbHkgZml2ZSB0aG91c2FuZCB3b21lbiBtYXJjaGVkIGluIEZlYnJ1YXJ5IDIwMTggaW4gZnJvbnQgb2YgdGhlIEFyZ2VudGluZSBDb25ncmVzcyB0byBkZW1hbmQgdGhlIGxlZ2FsaXphdGlvbiBvZiBhYm9ydGlvbi4gPC9hPidcbiAgICAgICdBVVMnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYWJjLm5ldC5hdS9uZXdzL2hlYWx0aC8yMDE3LTA3LTIyL25hdHVyYWwtbWV0aG9kcy1vZi1jb250cmFjZXB0aW9uLW9uLXRoZS1yaXNlLWluLWF1c3RyYWxpYS84NjgzMzQ2XCIgdGFyZ2V0PVwiX2JsYW5rXCI+TmF0dXJhbCBtZXRob2RzIG9mIGNvbnRyYWNlcHRpb24gb24gdGhlIHJpc2UgaW4gQXVzdHJhbGlhLCBhY2NvcmRpbmcgdG8gYW4gaW52ZXN0aWdhdGlvbiBvZiBNb25hc2ggVW5pdmVyc2l0eS4gPC9hPidcbiAgICAgICdCRUwnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiIHRhcmdldD1cIl9ibGFua1wiPkJlbGdpdW0gaGF2ZSBkb25hdGVkIDEwIG1pbGxpb24gZXVyb3MgdG8gdGhlIDxpPlNoZSBEZWNpZGVzPC9pPiBwcm95ZWN0LCBsYXVuY2hlZCBieSB0aGUgRHV0Y2ggZ292ZXJubWVudCB0byBib29zdCBjb250cmFjZXB0aW9uIGluIGRldmVsb3BpbmcgY291bnRyaWVzLiA8L2E+J1xuICAgICAgJ0JPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZWZlLmNvbS9lZmUvYW1lcmljYS9zb2NpZWRhZC9sYS12ZXJnw7xlbnphLXktZWwtZXN0aWdtYS1kZS1wZWRpci1wcmVzZXJ2YXRpdm9zLWVuLWJvbGl2aWEvLzIwMDAwMDEzLTMyNjU2NTJcIiB0YXJnZXQ9XCJfYmxhbmtcIj5Cb2xpdmlhXFwncyBwaGFybWFjaWVzIGhhdmUgZGV2ZWxvcGVkIGEgc2VjcmV0IGNvZGUgdG8gYXNrIGZvciBjb25kb21zIGFuZCB0aGVyZWZvcmUsIHRvIGF2b2lkIHN0aWdtYSBhYm91dCBidXlpbmcgdGhlbS48L2E+J1xuICAgICAgJ0NITic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxNy8wMS8wNy93b3JsZC9hc2lhL2FmdGVyLW9uZS1jaGlsZC1wb2xpY3ktb3V0cmFnZS1hdC1jaGluYXMtb2ZmZXItdG8tcmVtb3ZlLWl1ZHMuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPkFmdGVyIG9uZSBjaGlsZCBwb2xpY2l5LCBvdXRyYWdlIGF0IENoaW5hXFwncyBvZmZlciB0byByZW1vdmUgSVVEcy48L2E+J1xuICAgICAgJ1NMVic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC1wcm9mZXNzaW9uYWxzLW5ldHdvcmsvZ2FsbGVyeS8yMDE3L21heS8yNi9yZXByb2R1Y3RpdmUtcmlnaHRzLXppa2Etd29tZW4tZWwtc2FsdmFkb3ItaW4tcGljdHVyZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBTYWx2YWRvciBpcyBvbmUgb2Ygc2l4IGNvdW50cmllcyB3aGVyZSBhYm9ydGlvbiBpcyBiYW5uZWQgdW5kZXIgYW55IGNpcmN1bXN0YW5jZXMsIGFuZCB3b21lbiB3aG8gdW5kZXJnbyBpdCBjb3VsZCBmYWNlIHByaXNvbiA8L2E+J1xuICAgICAgJ0ZJTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5oZWxzaW5raXRpbWVzLmZpL2ZpbmxhbmQvZmlubGFuZC9uZXdzL2RvbWVzdGljLzE1MjcxLWhlbHNpbmtpLXRvLW9mZmVyLXllYXItcy13b3J0aC1vZi1jb250cmFjZXB0aXZlLXBpbGxzLXRvLXVuZGVyLTI1LXllYXItb2xkcy5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SGVsc2lua2kgdG8gb2ZmZXIgeWVhcuKAmXMgd29ydGggb2YgY29udHJhY2VwdGl2ZSBwaWxscyB0byB1bmRlciAyNS15ZWFyLW9sZHMuPC9hPidcbiAgICAgICdGUkEnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNvbm5leGlvbmZyYW5jZS5jb20vRnJlbmNoLW5ld3MvRnJlbmNoLXdvbWVuLW9wdC1mb3ItYWx0ZXJuYXRpdmVzLWFzLVBpbGwtdXNlLWRyb3BzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RnJlbmNoIHdvbWVuIG9wdCBmb3IgYWx0ZXJuYXRpdmVzIGFzIFBpbGwgdXNlIGRyb3BzLjwvYT4nXG4gICAgICAnR01CJzogJ0luIFRoZSBHYW1iaWEsIG1hbnkgd29tZW4gdXNlIGEgdHJhZGl0aW9uYWwgbWV0aG9kIHRoYXQgaW52b2x2ZXMgdHlpbmcgYSByb3BlLCBhIGJyYW5jaCBvciBhIHBpZWNlIG9mIHBhcGVyIGFyb3VuZCB0aGUgd2Fpc3Qgd2l0aCAtb3Igd2l0aG91dC0gcGhyYXNlcyBmcm9tIHRoZSBLb3JhbiBpbiBpdC4nXG4gICAgICAnREVVJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR3LmNvbS9lbi9mcmVlLXByZXNjcmliZWQtY29udHJhY2VwdGlvbi1mb3ItbG93LWVhcm5lcnMvYS0zODE2MTU3N1wiIHRhcmdldD1cIl9ibGFua1wiPkEgdHJpYWwgc2NoZW1lIGluIEdlcm1hbnkgaXMgaGVscGluZyB3b21lbiBvbiBsb3cgaW5jb21lcyB0byBhdm9pZCBzYWNyaWZpY2luZyB0aGVpciBjb250cmFjZXB0aW9uLjwvYT4nXG4gICAgICAnR1RNJzogJzxhIGhyZWY9XCJodHRwOi8vYnVmZi5seS8ydGFZd2NvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+UmVsaWdpb24gaGFzIGEgbWFqb3IgaW5mbHVlbmNlIGluIHNleHVhbCBlZHVjYXRpb24gb2YgR3VhdGVtYWxhIHlvdW5nIHBlb3BsZS48L2E+J1xuICAgICAgJ0lSTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL3dvcmxkLzIwMTgvamFuLzI5L2lyZWxhbmQtdG8tZ3JlZW5saWdodC1yZWZlcmVuZHVtLW9uLWFib3J0aW9uLWxhdy1yZWZvcm1cIiB0YXJnZXQ9XCJfYmxhbmtcIj5JcmlzaCByZWZlcmVuZHVtIG9uIGFib3J0aW9uIHJlZm9ybSB0byBiZSBoZWxkIGJ5IGVuZCBvZiBNYXkgMjAxODwvYT4nXG4gICAgICAnSVNSJzogJ0luIHVsdHJhIG9ydGhvZG94IGp1ZGFpc20sIGNvbnRyYWNlcHRpdmUgdXNlIGlzIG9ubHkgcGVybWl0dGVkIGlmIHRoZSByYWJiaSBnaXZlcyBwcmV2aW91cyBwZXJtaXNzaW9uIHRvIHRoZSB3b21hbi4nXG4gICAgICAnSlBOJzogJ0phcGFuLCBldmVuIGlmIGl0IGlzIHBhcnQgb2YgdGhlIGdyb3VwIG9mIGNvdW50cmllcyB3aXRoIGhpZ2ggaW5jb21lLCBoYXMgdW5tZXQgbmVlZHMgZm9yIGNvbnRyYWNlcHRpb24gYXQgdGhlIGxldmVsIG9mIGNvdW50cmllcyB3aXRoIGxvdyBpbmNvbWUuJ1xuICAgICAgJ1BSSyc6ICc5NSUgb2Ygd29tZW4gd2hvIHVzZSBjb250cmFjZXB0aXZlIG1ldGhvZHMgaW4gTm9ydGggS29yZWEgaGF2ZSBjaG9zZW4gdG8gdXNlIElVRHMuIEl0IGlzIHRoZSBoaWdoZXN0IHBlcmNlbnRhZ2Ugb2YgdXNlIG9mIHRoaXMgbWV0aG9kIHdvcmxkd2lkZS4nXG4gICAgICAnTkxEJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5EdXRjaCBpbml0aWF0aXZlIGJyaW5ncyBpbiDigqwxODFtIGZvciBmYW1pbHkgcGxhbm5pbmcgY2FtcGFpZ24uPC9hPidcbiAgICAgICdQRVInOiAnPGEgaHJlZj1cImh0dHBzOi8vaW50ZXJhY3RpdmUucXVpcHUtcHJvamVjdC5jb20vIy9lcy9xdWlwdS9pbnRyb1wiIHRhcmdldD1cIl9ibGFua1wiPkluIHRoZSAxOTkwcywgQWxiZXJ0byBGdWppbW9yaSwgZm9ybWVyIHByZXNpZGVudCBvZiBQZXJ1LCBsYXVuY2hlZCBhIG5ldyBmYW1pbHkgcGxhbm5pbmcgcHJvZ3JhbW1lIHRoYXQgcmVzdWx0ZWQgaW4gdGhlIHN0ZXJpbGlzYXRpb24gb2YgMjcyLDAyOCB3b21lbiBhbmQgMjIsMDA0IG1lbiBpbiBvbmx5IDQgeWVhcnMuPC9hPidcbiAgICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj4gSG93IGJpdHRlciBoZXJicyBhbmQgYm90Y2hlZCBhYm9ydGlvbnMga2lsbCB0aHJlZSB3b21lbiBhIGRheSBpbiB0aGUgUGhpbGlwcGluZXMuPC9hPidcbiAgICAgICdQT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmFtbmVzdHkub3JnL2VuL2xhdGVzdC9uZXdzLzIwMTcvMDYvcG9sYW5kLWVtZXJnZW5jeS1jb250cmFjZXB0aW9uLXJlc3RyaWN0aW9ucy1jYXRhc3Ryb3BoaWMtZm9yLXdvbWVuLWFuZC1naXJscy9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Qb2xpc2ggR292ZXJubWVudCB0YWtlcyBhIHN0ZXAgYmFjayBpbiB0aGUgYWNjZXNzIHRvIHRoZSBcIm1vcm5pbmctYWZ0ZXJcIiBwaWxsIGFuZCBpdCBiZWNvbWVzIHRoZSBvbmx5IEV1cm9wZWFuIGNvdW50cnkgd2hlcmUgd29tZW4gbmVlZCBhIHByZXNjcmlwdGlvbiBmb3IgdGhlIHVzZSBvZiB0aGlzIGNvbnRyYWNlcHRpdmUgbWV0aG9kLjwvYT4nXG4gICAgICAnU1NEJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvbWF5LzI1L2V2ZXJ5LXllYXItaS1naXZlLWJpcnRoLXdhci1kcml2aW5nLWNvbnRyYWNlcHRpb24tY3Jpc2lzLXN1ZGFuLW51YmEtbW91bnRhaW5zXCIgdGFyZ2V0PVwiX2JsYW5rXCI+XFwnRXZlcnkgeWVhciwgSSBnaXZlIGJpcnRoXFwnOiB3aHkgd2FyIGlzIGRyaXZpbmcgYSBjb250cmFjZXB0aW9uIGNyaXNpcyBpbiBTdWRhbi48L2E+J1xuICAgICAgJ0VTUCc6ICc8YSBocmVmPVwiaHR0cDovL2NhZGVuYXNlci5jb20vZW1pc29yYS8yMDE3LzA5LzE5L3JhZGlvX21hZHJpZC8xNTA1ODQyOTMyXzEzMTAzMS5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TWFkcmlkIGlzIHRoZSBvbmx5IHJlZ2lvbmFsIGdvdmVybm1lbnQgdGhhdCBkb2VzIG5vdCBmaW5hbmNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyB3aXRoIGl0cyBmdW5kcy48L2E+J1xuICAgICAgJ1RVUic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL25ld3Mvd29ybGQtZXVyb3BlLTM2NDEzMDk3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+VHVya2V5XFwncyBFcmRvZ2FuIHdhcm5zIE11c2xpbXMgYWdhaW5zdCBiaXJ0aCBjb250cm9sLjwvYT4nXG4gICAgICAnVUdBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5uZXd2aXNpb24uY28udWcvbmV3X3Zpc2lvbi9uZXdzLzE0NTg4ODIvdWdhbmRhLWZhY2luZy0xNTAtbWlsbGlvbi1jb25kb20tc2hvcnRmYWxsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SW4gMjAxNywgVWdhbmRhIGZhY2VkIGEgMTUwIG1pbGxpb25zIG1hbGUgY29uZG9tcyBzaG9ydGZhbGwuPC9hPidcbiAgICAgICdVU0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTgvMDEvMTgvdXMvaGVhbHRoLWNhcmUtb2ZmaWNlLWFib3J0aW9uLWNvbnRyYWNlcHRpb24uaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPlRydW1wIGdpdmVzIGhlYWx0aCB3b3JrZXJzIG5ldyByZWxpZ2lvdXMgbGliZXJ0eSBwcm90ZWN0aW9ucy48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VGhlIHNob3J0YWdlIGFuZCBoaWdoIHByaWNlIG9mIGNvbnRyYWNlcHRpdmVzIGluIFZlbmV6dWVsYSBpbmZsdWVuY2VzIHRoZSBpbmNyZWFzZSBpbiB1bndhbnRlZCBwcmVnbmFuY2llczwvYT4nXG4gICAgICAnWk1CJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5pZGVvLm9yZy9wcm9qZWN0L2RpdmEtY2VudHJlc1wiIHRhcmdldD1cIl9ibGFua1wiPkluIFphbWJpYSwgYSByYWRpY2FsIG5ldyBhcHByb2FjaCB0byBjb250cmFjZXB0aW9uIGlzIGdpdmluZyBhZG9sZXNjZW50IGdpcmxzIHRoZSBpbmZvcm1hdGlvbiBhbmQgc2VydmljZXMgb2YgY29udHJhY2VwdGlvbiB3aGlsZSBkb2luZyB0aGUgbWFuaWN1cmUuPC9hPidcblxuXG4gIGNvbnN0cnVjdG9yOiAobGFuZywgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyX2NvdW50cnksIG1ldGhvZHNfa2V5cywgbWV0aG9kc19uYW1lcywgbWV0aG9kc19kaHNfbmFtZXMsIHJlYXNvbnNfbmFtZXMsIHJlYXNvbnNfZGhzX25hbWVzLCBweW0pIC0+XG5cbiAgICBAc2VudGVuY2VzID0gQHNlbnRlbmNlc1tsYW5nXVxuXG4gICAgQGRhdGEgPSBcbiAgICAgIHVzZTogICAgICAgIGRhdGFfdXNlXG4gICAgICB1bm1ldG5lZWRzOiBkYXRhX3VubWV0bmVlZHNcbiAgICAgIHJlYXNvbnM6ICAgIGRhdGFfcmVhc29uc1xuXG4gICAgQG1ldGhvZHNLZXlzICAgICAgPSBtZXRob2RzX2tleXNcbiAgICBAbWV0aG9kc05hbWVzICAgICA9IG1ldGhvZHNfbmFtZXNcbiAgICBAbWV0aG9kc0RIU05hbWVzICA9IG1ldGhvZHNfZGhzX25hbWVzXG4gICAgQHJlYXNvbnNOYW1lcyAgICAgPSByZWFzb25zX25hbWVzXG4gICAgQHJlYXNvbnNESFNOYW1lcyAgPSByZWFzb25zX2Roc19uYW1lc1xuXG4gICAgQHB5bSA9IHB5bVxuXG4gICAgQCRhcHAgPSAkKCcjY29udHJhY2VwdGl2ZXMtYXBwJylcblxuICAgIEAkYXBwLmZpbmQoJy5zZWxlY3QtY291bnRyeScpXG4gICAgICAuc2VsZWN0MigpXG4gICAgICAuY2hhbmdlIEBvblNlbGVjdENvdW50cnlcbiAgICAgIC52YWwgdXNlcl9jb3VudHJ5LmNvZGVcbiAgICAgIC50cmlnZ2VyICdjaGFuZ2UnXG5cbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLmNsaWNrIEBvblNlbGVjdEZpbHRlclxuXG4gICAgQCRhcHAuY3NzKCdvcGFjaXR5JywxKVxuXG5cbiAgb25TZWxlY3RDb3VudHJ5OiAoZSkgPT5cbiAgICBAY291bnRyeV9jb2RlID0gJChlLnRhcmdldCkudmFsKClcblxuICAgIHVzZSAgICAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kICAgICAgICA9IG51bGxcbiAgICBtZXRob2RfdmFsdWUgID0gbnVsbFxuICAgIHVubWV0bmVlZHMgICAgPSBudWxsXG4gICAgcmVhc29uICAgICAgICA9IG51bGxcbiAgICByZWFzb25fdmFsdWUgID0gbnVsbFxuXG4gICAgIyBoaWRlIGZpbHRlcnMgJiBjbGVhciBhY3RpdmUgYnRuc1xuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLmhpZGUoKS5maW5kKCcuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgIyBoaWRlIGZpbHRlcnMgcmVzdWx0c1xuICAgICQoJy5jb250cmFjZXB0aXZlcy1maWx0ZXInKS5oaWRlKClcblxuICAgIGlmIEBkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS55ZWFyXG4gICAgICAjIGxvYWQgY291bnRyeSBkaHMgZGF0YVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfYWxsLmNzdicsIChlcnJvciwgZGF0YSkgPT5cbiAgICAgICAgZCA9IGRhdGFbMF1cbiAgICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICAgIEBzZXRBcHBJdGVtRGF0YSBAJGFwcCwgMTAwKihkLm4tZC5ub3RfdXNpbmdfY29udHJhY2VwdGlvbikvZC5uLCBAbWV0aG9kc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX21ldGhvZF0sIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBAcmVhc29uc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX3JlYXNvbl0sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29ucywgQHNlbnRlbmNlc1tAY291bnRyeV9jb2RlXVxuICAgICAgICAjIHNob3cgZmlsdGVyc1xuICAgICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5zaG93KClcbiAgICAgICAgIyB1cGRhdGUgaWZyYW1lIGhlaWdodFxuICAgICAgICBpZiBAcHltXG4gICAgICAgICAgQHB5bS5zZW5kSGVpZ2h0KClcbiAgICBlbHNlXG4gICAgICAjIHNldCBkYXRhIHllYXJcbiAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCAnMjAxNS0xNidcbiAgICAgICMgVXNlXG4gICAgICBjb3VudHJ5VXNlID0gQGRhdGEudXNlLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGNvbnNvbGUubG9nIGNvdW50cnlVc2VcbiAgICAgIGlmIGNvdW50cnlVc2UgYW5kIGNvdW50cnlVc2VbMF1cbiAgICAgICAgaWYgY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXSAhPSAnMCdcbiAgICAgICAgICB1c2UgICAgICAgICAgID0gcGFyc2VGbG9hdChjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKSArIHBhcnNlRmxvYXQoY291bnRyeVVzZVswXVsnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCddKVxuICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBAbWV0aG9kc0tleXMubWFwIChrZXksIGkpID0+IHsnbmFtZSc6IEBtZXRob2RzTmFtZXNbaV0sICd2YWx1ZSc6ICtjb3VudHJ5VXNlWzBdW2tleV19XG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICBtZXRob2QgICAgICAgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0ubmFtZVxuICAgICAgICBtZXRob2RfdmFsdWUgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0udmFsdWVcbiAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgY291bnRyeVVubWV0bmVlZHMgPSBAZGF0YS51bm1ldG5lZWRzLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgICAjIHVzZSBzdXJ2ZXkgZGF0YSBpZiBhdmFpbGFibGUsIHVzZSBlc3RpbWF0ZWQgaWYgbm90XG4gICAgICAgIHVubWV0bmVlZHMgPSBpZiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gdGhlbiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gZWxzZSBjb3VudHJ5VW5tZXRuZWVkc1swXVsnZXN0aW1hdGVkJ10gXG4gICAgICAjIFJlYXNvbnNcbiAgICAgIGNvdW50cnlSZWFzb25zID0gQGRhdGEucmVhc29ucy5maWx0ZXIgKGQpID0+IGQuY29kZSA9PSBAY291bnRyeV9jb2RlXG4gICAgICBpZiBjb3VudHJ5UmVhc29ucyBhbmQgY291bnRyeVJlYXNvbnNbMF1cbiAgICAgICAgcmVhc29ucyAgICAgID0gT2JqZWN0LmtleXMoQHJlYXNvbnNOYW1lcykubWFwIChyZWFzb24pID0+IHsnbmFtZSc6IEByZWFzb25zTmFtZXNbcmVhc29uXSwgJ3ZhbHVlJzogK2NvdW50cnlSZWFzb25zWzBdW3JlYXNvbl19XG4gICAgICAgIHJlYXNvbnMgICAgICA9IHJlYXNvbnMuc29ydCAoYSxiKSAtPiBiLnZhbHVlLWEudmFsdWVcbiAgICAgICAgcmVhc29uICAgICAgID0gcmVhc29uc1swXS5uYW1lXG4gICAgICAgIHJlYXNvbl92YWx1ZSA9IHJlYXNvbnNbMF0udmFsdWVcbiAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCB1c2UsIG1ldGhvZCwgbWV0aG9kX3ZhbHVlLCB1bm1ldG5lZWRzLCByZWFzb24sIHJlYXNvbl92YWx1ZSwgQHNlbnRlbmNlc1tAY291bnRyeV9jb2RlXVxuICAgICAgIyB1cGRhdGUgaWZyYW1lIGhlaWdodFxuICAgICAgaWYgQHB5bVxuICAgICAgICBAcHltLnNlbmRIZWlnaHQoKVxuXG5cbiAgb25TZWxlY3RGaWx0ZXI6IChlKSA9PlxuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGlmIEBmaWx0ZXIgIT0gJChlLnRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUge3Njcm9sbFRvcDogQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykub2Zmc2V0KCkudG9wLTE1fSwgNDAwXG4gICAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMgLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgJHRhcmdldCA9ICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgQGZpbHRlciA9ICR0YXJnZXQuYXR0cignaHJlZicpLnN1YnN0cmluZygxKVxuICAgICAgJCgnLmNvbnRyYWNlcHRpdmVzLWZpbHRlcicpLmhpZGUoKVxuICAgICAgQGZpbHRlckVsID0gJCgnIycrQGZpbHRlcikuc2hvdygpXG4gICAgICAjIGxvYWQgY3N2IGZpbGVcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLycrQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ubmFtZSsnXycrQGZpbHRlcl9rZXlzW0BmaWx0ZXJdKycuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBpZiBkYXRhXG4gICAgICAgICAgZGF0YS5mb3JFYWNoIChkKSA9PlxuICAgICAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEBmaWx0ZXJFbC5maW5kKCcjJytAZmlsdGVyKyctJytkLmlkKSwgMTAwKihkLm4tZC5ub3RfdXNpbmdfY29udHJhY2VwdGlvbikvZC5uLCBAbWV0aG9kc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX21ldGhvZF0sIDEwMCpkLm1vc3RfcG9wdWxhcl9tZXRob2Rfbi9kLm4sIDEwMCpkLndpdGhfdW5tZXRfbmVlZHMvZC5uLCBAcmVhc29uc0RIU05hbWVzW2QubW9zdF9wb3B1bGFyX3JlYXNvbl0sIDEwMCpkLm1vc3RfcG9wdWxhcl9yZWFzb25fbi9kLm5fcmVhc29uc1xuICAgICAgICAgICMgVXBkYXRlIGlmcmFtZSBoZWlnaHRcbiAgICAgICAgICBpZiBAcHltXG4gICAgICAgICAgICBAcHltLnNlbmRIZWlnaHQoKVxuXG5cbiAgc2V0QXBwSXRlbURhdGE6ICgkZWwsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlLCBzZW50ZW5jZSkgLT5cblxuICAgICNjb25zb2xlLmxvZyAnc2V0QXBwSXRlbURhdGEnLCAkZWwsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlXG5cbiAgICBpZiB1c2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtdXNlJykuaHRtbCBNYXRoLnJvdW5kKCt1c2UpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdXNlJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdXNlJykuaGlkZSgpXG5cbiAgICBpZiBtZXRob2RcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtbWFpbi1tZXRob2QnKS5odG1sIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZC12YWx1ZScpLmh0bWwgTWF0aC5yb3VuZCgrbWV0aG9kX3ZhbHVlKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLW1ldGhvZCcpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLW1ldGhvZCcpLmhpZGUoKVxuXG4gICAgaWYgdW5tZXRuZWVkc1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11bm1ldG5lZWRzJykuaHRtbCBNYXRoLnJvdW5kKCt1bm1ldG5lZWRzKSsnJSdcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11bm1ldG5lZWRzJykuaGlkZSgpXG5cbiAgICBpZiByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uJykuaHRtbCByZWFzb25cbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEtcmVhc29uLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCtyZWFzb25fdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtcmVhc29uJykuaGlkZSgpXG5cbiAgICBpZiBzZW50ZW5jZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtc2VudGVuY2UnKS5odG1sKHNlbnRlbmNlKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1zZW50ZW5jZScpLmhpZGUoKVxuXG4iLCIjIE1haW4gc2NyaXB0IGZvciBjb250cmFjZXB0aXZlcyBhcnRpY2xlc1xuXG4oKCQpIC0+XG4gIFxuICB1c2VyQ291bnRyeSA9IHt9XG5cbiAgIyBHZXQgY3VycmVudCBhcnRpY2xlIGxhbmcgJiBiYXNlIHVybFxuICBsYW5nICAgID0gJCgnYm9keScpLmRhdGEoJ2xhbmcnKVxuICBiYXNldXJsID0gJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKVxuXG4gICNjb25zb2xlLmxvZyAnY29udHJhY2VwdGl2ZXMnLCBsYW5nLCBiYXNldXJsXG5cbiAgIyBzZXR1cCBmb3JtYXQgbnVtYmVyc1xuICBpZiBsYW5nID09ICdlcydcbiAgICBkMy5mb3JtYXREZWZhdWx0TG9jYWxlIHtcbiAgICAgIFwiY3VycmVuY3lcIjogW1wiJFwiLFwiXCJdXG4gICAgICBcImRlY2ltYWxcIjogXCIsXCJcbiAgICAgIFwidGhvdXNhbmRzXCI6IFwiLlwiXG4gICAgICBcImdyb3VwaW5nXCI6IFszXVxuICAgIH1cblxuICBtZXRob2RzX2tleXMgPSBbXG4gICAgXCJGZW1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIlxuICAgIFwiSVVEXCJcbiAgICBcIkltcGxhbnRcIlxuICAgIFwiSW5qZWN0YWJsZVwiXG4gICAgXCJQaWxsXCJcbiAgICBcIk1hbGUgY29uZG9tXCJcbiAgICBcIkZlbWFsZSBjb25kb21cIlxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIlxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiXG4gIF1cblxuICBtZXRob2RzX25hbWVzID0gXG4gICAgJ2VzJzogW1xuICAgICAgXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgXCJlc3RlcmlsaXphY2nDs24gbWFzY3VsaW5hXCJcbiAgICAgIFwiRElVXCJcbiAgICAgIFwiaW1wbGFudGVcIlxuICAgICAgXCJpbnllY3RhYmxlXCJcbiAgICAgIFwicMOtbGRvcmFcIlxuICAgICAgXCJjb25kw7NuIG1hc2N1bGlub1wiXG4gICAgICBcImNvbmTDs24gZmVtZW5pbm9cIlxuICAgICAgXCJtw6l0b2RvcyBkZSBiYXJyZXJhIHZhZ2luYWxcIlxuICAgICAgXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgIFwiYW50aWNvbmNlcHRpdm9zIGRlIGVtZXJnZW5jaWFcIlxuICAgICAgXCJvdHJvcyBtw6l0b2RvcyBtb2Rlcm5vc1wiXG4gICAgICBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgIF1cbiAgICAnZW4nOiBbXG4gICAgICBcImZlbWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgIFwibWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgIFwiSVVEXCJcbiAgICAgIFwiaW1wbGFudFwiXG4gICAgICBcImluamVjdGFibGVcIlxuICAgICAgXCJwaWxsXCJcbiAgICAgIFwibWFsZSBjb25kb21cIlxuICAgICAgXCJmZW1hbGUgY29uZG9tXCJcbiAgICAgIFwidmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIlxuICAgICAgXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICBcImVtZXJnZW5jeSBjb250cmFjZXB0aW9uXCJcbiAgICAgIFwib3RoZXIgbW9kZXJuIG1ldGhvZHNcIlxuICAgICAgXCJ0cmFkaXRpb25hbCBtZXRob2RzXCJcbiAgICBdXG5cbiAgbWV0aG9kc19kaHNfbmFtZXMgPSBcbiAgICAnZXMnOiBcbiAgICAgICcxJzogXCJww61sZG9yYVwiXG4gICAgICAnMic6IFwiRElVXCJcbiAgICAgICczJzogXCJpbnllY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kw7NuXCJcbiAgICAgICc2JzogXCJlc3RlcmlsaXphY2nDs24gZmVtZW5pbmFcIlxuICAgICAgJzcnOiBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgJzgnOiBcImFic3RpbmVuY2lhIHBlcmnDs2RpY2FcIlxuICAgICAgJzknOiBcIm1hcmNoYSBhdHLDoXNcIlxuICAgICAgJzEwJzogXCJvdHJvc1wiXG4gICAgICAnMTEnOiBcImltcGxhbnRlXCJcbiAgICAgICcxMyc6IFwibcOpdG9kbyBkZSBsYSBhbWVub3JyZWEgZGUgbGEgbGFjdGFuY2lhIChNRUxBKVwiXG4gICAgICAnMTcnOiBcIm3DqXRvZG9zIHRyYWRpY2lvbmFsZXNcIlxuICAgICdlbic6XG4gICAgICAnMSc6IFwicGlsbFwiXG4gICAgICAnMic6IFwiSVVEXCJcbiAgICAgICczJzogXCJpbmplY3RhYmxlXCJcbiAgICAgICc1JzogXCJjb25kb21cIlxuICAgICAgJzYnOiBcImZlbWFsZSBzdGVyaWxpc2F0aW9uXCJcbiAgICAgICc3JzogXCJtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgJzgnOiBcInBlcmlvZGljIGFic3RpbmVuY2VcIlxuICAgICAgJzknOiBcIndpdGhkcmF3YWxcIlxuICAgICAgJzEwJzogXCJvdGhlclwiXG4gICAgICAnMTEnOiBcImltcGxhbnRcIlxuICAgICAgJzEzJzogXCJsYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgICAnMTcnOiBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuXG5cbiAgIyMjXG4gIG1ldGhvZHNfaWNvbnMgPSBcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiTWFsZSBzdGVyaWxpemF0aW9uXCI6ICdzdGVyaWxpemF0aW9uJ1xuICAgIFwiSVVEXCI6ICdkaXUnXG4gICAgXCJJbXBsYW50XCI6IG51bGxcbiAgICBcIkluamVjdGFibGVcIjogJ2luamVjdGFibGUnXG4gICAgXCJQaWxsXCI6ICdwaWxsJ1xuICAgIFwiTWFsZSBjb25kb21cIjogJ2NvbmRvbSdcbiAgICBcIkZlbWFsZSBjb25kb21cIjogbnVsbFxuICAgIFwiVmFnaW5hbCBiYXJyaWVyIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiTGFjdGF0aW9uYWwgYW1lbm9ycmhlYSBtZXRob2QgKExBTSlcIjogbnVsbFxuICAgIFwiRW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIjogbnVsbFxuICAgIFwiT3RoZXIgbW9kZXJuIG1ldGhvZHNcIjogbnVsbFxuICAgIFwiQW55IHRyYWRpdGlvbmFsIG1ldGhvZFwiOiAndHJhZGl0aW9uYWwnXG4gICMjI1xuXG4gIHJlYXNvbnNfbmFtZXMgPSBcbiAgICAnZXMnOlxuICAgICAgXCJhXCI6IFwibm8gZXN0w6FuIGNhc2FkYXNcIlxuICAgICAgXCJiXCI6IFwibm8gdGllbmVuIHNleG9cIlxuICAgICAgXCJjXCI6IFwidGllbmVuIHNleG8gaW5mcmVjdWVudGVcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNpYSBvIGVzdGVyaWxpemFjacOzblwiXG4gICAgICBcImVcIjogXCJzb24gc3ViZmVjdW5kYXMgbyBpbmZlY3VuZGFzXCJcbiAgICAgIFwiZlwiOiBcImFtZW5vcnJlYSBwb3N0cGFydG9cIlxuICAgICAgXCJnXCI6IFwiZXN0w6FuIGRhbmRvIGVsIHBlY2hvXCJcbiAgICAgIFwiaFwiOiBcImZhdGFsaXN0YVwiXG4gICAgICBcImlcIjogXCJsYSBtdWplciBzZSBvcG9uZVwiXG4gICAgICBcImpcIjogXCJlbCBtYXJpZG8gbyBsYSBwYXJlamEgc2Ugb3BvbmVcIlxuICAgICAgXCJrXCI6IFwib3Ryb3Mgc2Ugb3BvbmVuXCIgICAgICAgIFxuICAgICAgXCJsXCI6IFwicHJvaGliaWNpw7NuIHJlbGlnaW9zYVwiICBcbiAgICAgIFwibVwiOiBcIm5vIGNvbm9jZSBsb3MgbcOpdG9kb3NcIlxuICAgICAgXCJuXCI6IFwibm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zXCJcbiAgICAgIFwib1wiOiBcInByZW9jdXBhY2lvbmVzIGRlIHNhbHVkXCIgICAgICAgICAgICAgICAgICAgICBcbiAgICAgIFwicFwiOiBcIm1pZWRvIGEgbG9zIGVmZWN0b3Mgc2VjdW5kYXJpb3MvcHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiBcbiAgICAgIFwicVwiOiBcImZhbHRhIGRlIGFjY2Vzby9tdXkgbGVqb3NcIlxuICAgICAgXCJyXCI6IFwiY3Vlc3RhbiBkZW1hc2lhZG9cIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50ZXMgcGFyYSBzdSB1c29cIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICAgXCJ1XCI6IFwiZWwgbcOpdG9kbyBlbGVnaWRvIG5vIGVzdMOhIGRpc3BvbmlibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gaGF5IG3DqXRvZG9zIGRpc3BvbmlibGVzXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90cm9zXCJcbiAgICAgIFwielwiOiBcIm5vIGxvIHPDqVwiXG4gICAgJ2VuJzpcbiAgICAgIFwiYVwiOiBcIm5vdCBtYXJyaWVkXCJcbiAgICAgIFwiYlwiOiBcIm5vdCBoYXZpbmcgc2V4XCJcbiAgICAgIFwiY1wiOiBcImluZnJlcXVlbnQgc2V4XCJcbiAgICAgIFwiZFwiOiBcIm1lbm9wYXVzYWwvaHlzdGVyZWN0b215XCJcbiAgICAgIFwiZVwiOiBcInN1YmZlY3VuZC9pbmZlY3VuZFwiXG4gICAgICBcImZcIjogXCJwb3N0cGFydHVtIGFtZW5vcnJoZWljXCJcbiAgICAgIFwiZ1wiOiBcImJyZWFzdGZlZWRpbmdcIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RpY1wiXG4gICAgICBcImlcIjogXCJyZXNwb25kZW50IG9wcG9zZWRcIlxuICAgICAgXCJqXCI6IFwiaHVzYmFuZC9wYXJ0bmVyIG9wcG9zZWRcIlxuICAgICAgXCJrXCI6IFwib3RoZXJzIG9wcG9zZWRcIlxuICAgICAgXCJsXCI6IFwicmVsaWdpb3VzIHByb2hpYml0aW9uXCJcbiAgICAgIFwibVwiOiBcImtub3dzIG5vIG1ldGhvZFwiXG4gICAgICBcIm5cIjogXCJrbm93cyBubyBzb3VyY2VcIlxuICAgICAgXCJvXCI6IFwiaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicFwiOiBcImZlYXIgb2Ygc2lkZSBlZmZlY3RzL2hlYWx0aCBjb25jZXJuc1wiXG4gICAgICBcInFcIjogXCJsYWNrIG9mIGFjY2Vzcy90b28gZmFyXCJcbiAgICAgIFwiclwiOiBcImNvc3RzIHRvbyBtdWNoXCJcbiAgICAgIFwic1wiOiBcImluY29udmVuaWVudCB0byB1c2VcIlxuICAgICAgXCJ0XCI6IFwiaW50ZXJmZXJlcyB3aXRoIGJvZHnCkidzIHByb2Nlc3Nlc1wiXG4gICAgICBcInVcIjogXCJwcmVmZXJyZWQgbWV0aG9kIG5vdCBhdmFpbGFibGVcIlxuICAgICAgXCJ2XCI6IFwibm8gbWV0aG9kIGF2YWlsYWJsZVwiXG4gICAgICBcIndcIjogXCIobm8gZXN0w6FuZGFyKVwiXG4gICAgICBcInhcIjogXCJvdGhlclwiXG4gICAgICBcInpcIjogXCJkb24ndCBrbm93XCJcblxuICByZWFzb25zX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJ3YzYTA4YSc6ICdubyBlc3TDoW4gY2FzYWRhcydcbiAgICAgICd2M2EwOGInOiAnbm8gdGllbmVuIHNleG8nXG4gICAgICAndjNhMDhjJzogJ3RpZW5lbiBzZXhvIGluZnJlY3VlbnRlJ1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuJ1xuICAgICAgJ3YzYTA4ZSc6ICdzb24gc3ViZmVjdW5kYXMgbyBpbmZlY3VuZGFzJ1xuICAgICAgJ3YzYTA4Zic6ICdhbWVub3JyZWEgcG9zdHBhcnRvJ1xuICAgICAgJ3YzYTA4Zyc6ICdlc3TDoW4gZGFuZG8gZWwgcGVjaG8nXG4gICAgICAndjNhMDhoJzogJ2ZhdGFsaXN0YSdcbiAgICAgICd2M2EwOGknOiAnbGEgbXVqZXIgc2Ugb3BvbmUnXG4gICAgICAndjNhMDhqJzogJ2VsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGsnOiAnb3Ryb3Mgc2Ugb3BvbmVuJyAgICAgICAgXG4gICAgICAndjNhMDhsJzogJ3Byb2hpYmljacOzbiByZWxpZ2lvc2EnXG4gICAgICAndjNhMDhtJzogJ25vIGNvbm9jZSBsb3MgbcOpdG9kb3MnXG4gICAgICAndjNhMDhuJzogJ25vIGNvbm9jZSBuaW5ndW5hIGZ1ZW50ZSBkb25kZSBhZHF1aXJpcmxvcydcbiAgICAgICd2M2EwOG8nOiAncHJlb2N1cGFjaW9uZXMgZGUgc2FsdWQnXG4gICAgICAndjNhMDhwJzogJ21pZWRvIGEgbG9zIGVmZWN0b3Mgc2VjdW5kYXJpb3MnXG4gICAgICAndjNhMDhxJzogJ2ZhbHRhIGRlIGFjY2Vzby9tdXkgbGVqb3MnXG4gICAgICAndjNhMDhyJzogJ2N1ZXN0YW4gZGVtYXNpYWRvJ1xuICAgICAgJ3YzYTA4cyc6ICdpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzbydcbiAgICAgICd2M2EwOHQnOiBcImludGVyZmllcmUgY29uIGxvcyBwcm9jZXNvcyBkZWwgY3VlcnBvXCJcbiAgICAnZW4nOiBcbiAgICAgICd2M2EwOGEnOiAnbm90IG1hcnJpZWQnXG4gICAgICAndjNhMDhiJzogJ25vdCBoYXZpbmcgc2V4J1xuICAgICAgJ3YzYTA4Yyc6ICdpbmZyZXF1ZW50IHNleCdcbiAgICAgICd2M2EwOGQnOiAnbWVub3BhdXNhbC9oeXN0ZXJlY3RvbXknXG4gICAgICAndjNhMDhlJzogJ3N1YmZlY3VuZC9pbmZlY3VuZCdcbiAgICAgICd2M2EwOGYnOiAncG9zdHBhcnR1bSBhbWVub3JyaGVpYydcbiAgICAgICd2M2EwOGcnOiAnYnJlYXN0ZmVlZGluZydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RpYydcbiAgICAgICd2M2EwOGknOiAncmVzcG9uZGVudCBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4aic6ICdodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGsnOiAnb3RoZXJzIG9wcG9zZWQnXG4gICAgICAndjNhMDhsJzogJ3JlbGlnaW91cyBwcm9oaWJpdGlvbidcbiAgICAgICd2M2EwOG0nOiAna25vd3Mgbm8gbWV0aG9kJ1xuICAgICAgJ3YzYTA4bic6ICdrbm93cyBubyBzb3VyY2UnXG4gICAgICAndjNhMDhvJzogJ2hlYWx0aCBjb25jZXJucydcbiAgICAgICd2M2EwOHAnOiAnZmVhciBvZiBzaWRlIGVmZmVjdHMnXG4gICAgICAndjNhMDhxJzogJ2xhY2sgb2YgYWNjZXNzL3RvbyBmYXInXG4gICAgICAndjNhMDhyJzogJ2Nvc3RzIHRvbyBtdWNoJ1xuICAgICAgJ3YzYTA4cyc6ICdpbmNvbnZlbmllbnQgdG8gdXNlJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmZXJlcyB3aXRoIHRoZSBib2R5J3MgcHJvY2Vzc2VzXCJcblxuXG4gIHNldExvY2F0aW9uID0gKGxvY2F0aW9uLCBjb3VudHJpZXMpIC0+XG4gICAgaWYgbG9jYXRpb25cbiAgICAgIHVzZXJfY291bnRyeSA9IGNvdW50cmllcy5maWx0ZXIgKGQpIC0+IGQuY29kZTIgPT0gbG9jYXRpb24uY291bnRyeV9jb2RlXG4gICAgICBpZiB1c2VyX2NvdW50cnlbMF1cbiAgICAgICAgdXNlckNvdW50cnkuY29kZSA9IHVzZXJfY291bnRyeVswXS5jb2RlXG4gICAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSB1c2VyX2NvdW50cnlbMF1bJ25hbWVfJytsYW5nXVxuICAgIGVsc2VcbiAgICAgIGxvY2F0aW9uID0ge31cblxuICAgIHVubGVzcyBsb2NhdGlvbi5jb2RlXG4gICAgICB1c2VyQ291bnRyeS5jb2RlID0gJ0VTUCdcbiAgICAgIHVzZXJDb3VudHJ5Lm5hbWUgPSBpZiBsYW5nID09ICdlcycgdGhlbiAnRXNwYcOxYScgZWxzZSAnU3BhaW4nXG5cblxuICAjIFNldHVwXG4gICMgLS0tLS0tLS0tLS0tLS0tXG5cbiAgcHltQ2hpbGQgPSBuZXcgcHltLkNoaWxkKClcblxuICAjIExvYWQgbG9jYXRpb25cbiAgZDMuanNvbiAnaHR0cHM6Ly9mcmVlZ2VvaXAubmV0L2pzb24vJywgKGVycm9yLCBsb2NhdGlvbikgLT5cbiAgICAjIExvYWQgY3N2cyAmIHNldHVwIG1hcHNcbiAgICBkMy5xdWV1ZSgpXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtdXNlLWNvdW50cmllcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvdW5tZXQtbmVlZHMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMuY3N2J1xuICAgICAgLmRlZmVyIGQzLmNzdiwgIGJhc2V1cmwrJy9kYXRhL2NvdW50cmllcy1nbmktcG9wdWxhdGlvbi0yMDE2LmNzdidcbiAgICAgIC5kZWZlciBkMy5qc29uLCBiYXNldXJsKycvZGF0YS9tYXAtd29ybGQtMTEwLmpzb24nXG4gICAgICAuYXdhaXQgKGVycm9yLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIGNvdW50cmllcywgbWFwKSAtPlxuICAgICAgICBzZXRMb2NhdGlvbiBsb2NhdGlvbiwgY291bnRyaWVzXG4gICAgICAgIGlmICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKS5sZW5ndGhcbiAgICAgICAgICBuZXcgQ29udHJhY2VwdGl2ZXNBcHAgbGFuZywgZGF0YV91c2UsIGRhdGFfdW5tZXRuZWVkcywgZGF0YV9yZWFzb25zLCB1c2VyQ291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzW2xhbmddLCBtZXRob2RzX2Roc19uYW1lc1tsYW5nXSwgcmVhc29uc19uYW1lc1tsYW5nXSwgcmVhc29uc19kaHNfbmFtZXNbbGFuZ10sIHB5bUNoaWxkXG5cbikgalF1ZXJ5XG4iXX0=
