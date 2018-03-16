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
        'CHN': '<a href="https://www.nytimes.com/2017/01/07/world/asia/after-one-child-policy-outrage-at-chinas-offer-to-remove-iuds.html" target="_blank">After one child policiy, outrage at China\'s offer to remove IUDs.</a>',
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWNlcHRpdmVzLWFwcC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLXN0YXRpYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztnQ0FFWCxXQUFBLEdBQ0U7TUFBQSx5QkFBQSxFQUEyQixXQUEzQjtNQUNBLHlCQUFBLEVBQTJCLEtBRDNCO01BRUEseUJBQUEsRUFBMkIsV0FGM0I7TUFHQSx5QkFBQSxFQUEyQixRQUgzQjs7O2dDQUtGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FERjtNQUdBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FKRjtNQU1BLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FWRjtNQVlBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FiRjtNQWVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FoQkY7TUFrQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsTUFEUjtPQW5CRjtNQXFCQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsVUFBUjtRQUNBLE1BQUEsRUFBUSxNQURSO09BdEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0F6QkY7TUEyQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsU0FEUjtPQTVCRjtNQThCQSxLQUFBLEVBQ0U7UUFBQSxN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RjtBQUFBIiwiZmlsZSI6ImNvbnRyYWNlcHRpdmVzLXN0YXRpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIHdpbmRvdy5Db250cmFjZXB0aXZlc0FwcFxuXG4gIGZpbHRlcl9rZXlzOiBcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTAnOiAncmVzaWRlbmNlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMSc6ICdhZ2UnXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0yJzogJ2VkdWNhdGlvbidcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTMnOiAnd2VhbHRoJ1xuXG4gIGRoc19jb3VudHJpZXM6XG4gICAgJ0FGRyc6XG4gICAgICAnbmFtZSc6ICdBRklSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTcnXG4gICAgJ0FMQic6XG4gICAgICAnbmFtZSc6ICdBTElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ0FSTSc6XG4gICAgICAnbmFtZSc6ICdBTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0FHTyc6XG4gICAgICAnbmFtZSc6ICdBT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0FaRSc6XG4gICAgICAnbmFtZSc6ICdBWklSNTJEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JHRCc6XG4gICAgICAnbmFtZSc6ICdCRElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0JFTic6XG4gICAgICAnbmFtZSc6ICdCSklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ0JPTCc6XG4gICAgICAnbmFtZSc6ICdCT0lSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ0JESSc6XG4gICAgICAnbmFtZSc6ICdCVUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTAnXG4gICAgJ0NPRCc6XG4gICAgICAnbmFtZSc6ICdDRElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ0NPRyc6XG4gICAgICAnbmFtZSc6ICdDR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NJVic6XG4gICAgICAnbmFtZSc6ICdDSUlSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0NNUic6XG4gICAgICAnbmFtZSc6ICdDTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ0NPTCc6XG4gICAgICAnbmFtZSc6ICdDT0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ0RPTSc6XG4gICAgICAnbmFtZSc6ICdEUklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0VHWSc6XG4gICAgICAnbmFtZSc6ICdFR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0VUSCc6XG4gICAgICAnbmFtZSc6ICdFVElSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ0dIQSc6XG4gICAgICAnbmFtZSc6ICdHSElSNzJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0dNQic6XG4gICAgICAnbmFtZSc6ICdHTUlSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0dJTic6XG4gICAgICAnbmFtZSc6ICdHTklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0dUTSc6XG4gICAgICAnbmFtZSc6ICdHVUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ0dVWSc6XG4gICAgICAnbmFtZSc6ICdHWUlSNUlEVCdcbiAgICAgICd5ZWFyJzogJzIwMDknXG4gICAgJ0hORCc6XG4gICAgICAnbmFtZSc6ICdITklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEtMTInXG4gICAgJ0hUSSc6XG4gICAgICAnbmFtZSc6ICdIVElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0lORCc6XG4gICAgICAnbmFtZSc6ICdJQUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ0lETic6XG4gICAgICAnbmFtZSc6ICdJRElSNjNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0pPUic6XG4gICAgICAnbmFtZSc6ICdKT0lSNkNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ0tFTic6XG4gICAgICAnbmFtZSc6ICdLRUlSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0tITSc6XG4gICAgICAnbmFtZSc6ICdLSElSNzNEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ0xCUic6XG4gICAgICAnbmFtZSc6ICdMQklSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ0xTTyc6XG4gICAgICAnbmFtZSc6ICdMU0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQnXG4gICAgJ01BUic6XG4gICAgICAnbmFtZSc6ICdNQUlSNDNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDMtMDQnXG4gICAgJ01ERyc6XG4gICAgICAnbmFtZSc6ICdNRElSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgtMDknXG4gICAgJ01MSSc6XG4gICAgICAnbmFtZSc6ICdNTElSNTNEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ01NUic6XG4gICAgICAnbmFtZSc6ICdNTUlSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ01XSSc6XG4gICAgICAnbmFtZSc6ICdNV0lSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ01PWic6XG4gICAgICAnbmFtZSc6ICdNWklSNjJEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ05HQSc6XG4gICAgICAnbmFtZSc6ICdOR0lSNkFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05FUic6XG4gICAgICAnbmFtZSc6ICdOSUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ05BTSc6XG4gICAgICAnbmFtZSc6ICdOTUlSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ05QTCc6XG4gICAgICAnbmFtZSc6ICdOUElSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTYnXG4gICAgJ1BFUic6XG4gICAgICAnbmFtZSc6ICdQRUlSNklEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1BITCc6XG4gICAgICAnbmFtZSc6ICdQSElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1BBSyc6XG4gICAgICAnbmFtZSc6ICdQS0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1JXQSc6XG4gICAgICAnbmFtZSc6ICdSV0lSNzBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG4gICAgJ1NMRSc6XG4gICAgICAnbmFtZSc6ICdTTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMnXG4gICAgJ1NFTic6XG4gICAgICAnbmFtZSc6ICdTTklSNkREVCdcbiAgICAgICd5ZWFyJzogJzIwMTItMTMnXG4gICAgJ1NUUCc6XG4gICAgICAnbmFtZSc6ICdTVElSNTBEVCdcbiAgICAgICd5ZWFyJzogJzIwMDgnXG4gICAgJ1NXWic6XG4gICAgICAnbmFtZSc6ICdTWklSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDYnXG4gICAgJ1RDRCc6XG4gICAgICAnbmFtZSc6ICdURElSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTQtMTUnXG4gICAgJ1RHTyc6XG4gICAgICAnbmFtZSc6ICdUR0lSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTMtMTQnXG4gICAgJ1RKSyc6XG4gICAgICAnbmFtZSc6ICdUSklSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTInXG4gICAgJ1RMUyc6XG4gICAgICAnbmFtZSc6ICdUTElSNjFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDktMTAnXG4gICAgJ1RaQSc6XG4gICAgICAnbmFtZSc6ICdUWklSN0hEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUtMTYnXG4gICAgJ1VHQSc6XG4gICAgICAnbmFtZSc6ICdVR0lSNjBEVCdcbiAgICAgICd5ZWFyJzogJzIwMTEnXG4gICAgJ1pNQic6XG4gICAgICAnbmFtZSc6ICdaTUlSNTFEVCdcbiAgICAgICd5ZWFyJzogJzIwMDcnXG4gICAgJ1pXRSc6XG4gICAgICAnbmFtZSc6ICdaV0lSNzFEVCdcbiAgICAgICd5ZWFyJzogJzIwMTUnXG5cbiAgc2VudGVuY2VzOiBcbiAgICAnZXMnOlxuICAgICAgJ0FMQic6ICdMYSBtYXJjaGEgYXRyw6FzIGVzIGVsIHByaW1lciBtw6l0b2RvIGFudGljb25jZXB0aXZvIGRlIEFsYmFuaWEuIEFkZW3DoXMsIHNlIHRyYXRhIGRlbCBzZWd1bmRvIHBhw61zIGRvbmRlIGV4aXN0ZSBtYXlvciBvcG9zaWNpw7NuIGRlIGxhIHByb3BpYSBtdWplciwgbGEgcGFyZWphIG8gbGEgcmVsaWdpw7NuIGEgdG9tYXIgYW50aWNvbmNlcHRpdm9zLidcbiAgICAgICdBUkcnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNsYXJpbi5jb20vc29jaWVkYWQvY2FtcGFuYS1sZXktYWJvcnRvLWNvbWVuem8tMjAwNS1wcm95ZWN0by1wcmVzZW50by12ZWNlc18wX0JKdmRpMG5Qei5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VW5hcyBjaW5jbyBtaWwgbXVqZXJlcyBtYXJjaGFyb24gZW4gZmVicmVybyBkZSAyMDE4IGZyZW50ZSBhbCBDb25ncmVzbyBhcmdlbnRpbm8gcGFyYSBwZWRpciBsYSBsZWdhbGl6YWNpw7NuIGRlbCBhYm9ydG8uPC9hPidcbiAgICAgICdBVVMnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYWJjLm5ldC5hdS9uZXdzL2hlYWx0aC8yMDE3LTA3LTIyL25hdHVyYWwtbWV0aG9kcy1vZi1jb250cmFjZXB0aW9uLW9uLXRoZS1yaXNlLWluLWF1c3RyYWxpYS84NjgzMzQ2XCIgdGFyZ2V0PVwiX2JsYW5rXCI+TXVjaG9zIGF1c3RyYWxpYW5vcyBlc3TDoW4gdm9sdmllbmRvIGEgdXRpbGl6YXIgbcOpdG9kb3MgdHJhZGljaW9uYWxlcyBkZSBhbnRpY29uY2VwY2nDs24sIHNlZ8O6biB1biBlc3R1ZGlvIGRlIE1vbmFzaCBVbml2ZXJzaXR5LjwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5Cw6lsZ2ljYSBkb27DsyAxMCBtaWxsb25lcyBkZSBldXJvcyBwYXJhIGxhIGNhbXBhw7FhIDxpPlNoZSBEZWNpZGVzPC9pPiwgbGFuemFkYSBwb3IgZWwgR29iaWVybm8gaG9sYW5kw6lzIHBhcmEgY29udHJhcnJlc3RhciBsYSByZXRpcmFkYSBkZSBmb25kb3MgcGFyYSBwbGFuaWZpY2FjacOzbiBmYW1pbGlhciBkZSBUcnVtcC48L2E+J1xuICAgICAgJ0JPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuZWZlLmNvbS9lZmUvYW1lcmljYS9zb2NpZWRhZC9sYS12ZXJnw7xlbnphLXktZWwtZXN0aWdtYS1kZS1wZWRpci1wcmVzZXJ2YXRpdm9zLWVuLWJvbGl2aWEvLzIwMDAwMDEzLTMyNjU2NTJcIiB0YXJnZXQ9XCJfYmxhbmtcIj5GYXJtYWNpYXMgZGUgQm9saXZpYSBpbXBsZW1lbnRhcm9uIGPDs2RpZ29zIHNlY3JldG9zIHBhcmEgcGVkaXIgcHJlc2VydmF0aXZvcyB5IGV2aXRhciBlbCBlc3RpZ21hIGRlIGNvbXByYXIgZXN0b3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnQ0hOJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE3LzAxLzA3L3dvcmxkL2FzaWEvYWZ0ZXItb25lLWNoaWxkLXBvbGljeS1vdXRyYWdlLWF0LWNoaW5hcy1vZmZlci10by1yZW1vdmUtaXVkcy5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgR29iaWVybm8gY2hpbm8gb2ZyZWNlIGxhIHJldGlyYWRhIGdyYXR1aXRhIGRlIERJVXMgZGVzcHXDqXMgZGUgbGEgcG9sw610aWNhIGRlbCBoaWpvIMO6bmljby48L2E+J1xuICAgICAgJ1NMVic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC1wcm9mZXNzaW9uYWxzLW5ldHdvcmsvZ2FsbGVyeS8yMDE3L21heS8yNi9yZXByb2R1Y3RpdmUtcmlnaHRzLXppa2Etd29tZW4tZWwtc2FsdmFkb3ItaW4tcGljdHVyZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBTYWx2YWRvciBlcyBlbCDDum5pY28gcGHDrXMgZGVsIG11bmRvIGRvbmRlIGFib3J0YXIgZXN0w6EgcGVuYWRvIGNvbiBjw6FyY2VsLjwvYT4nXG4gICAgICAnRklOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmhlbHNpbmtpdGltZXMuZmkvZmlubGFuZC9maW5sYW5kL25ld3MvZG9tZXN0aWMvMTUyNzEtaGVsc2lua2ktdG8tb2ZmZXIteWVhci1zLXdvcnRoLW9mLWNvbnRyYWNlcHRpdmUtcGlsbHMtdG8tdW5kZXItMjUteWVhci1vbGRzLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBheXVudGFtaWVudG8gZGUgSGVsc2lua2kgcHJvcG9yY2lvbmEgYW50aWNvbmNlcHRpdm9zIGRlIG1hbmVyYSBncmF0dWl0YSBhIGxvcyBqw7N2ZW5lcyBtZW5vcmVzIGRlIDI1IGHDsW9zLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiIHRhcmdldD1cIl9ibGFua1wiPkVsIHVzbyBkZSBsYXMgcGFzdGlsbGFzIGFudGljb25jZXB0aXZhcyBzZSBoYSByZWR1Y2lkbyBlbiBGcmFuY2lhIGRlc2RlIDIwMTAuPC9hPidcbiAgICAgICdHTUInOiAnRW4gR2FtYmlhLCBtdWNoYXMgbXVqZXJlcyB1dGlsaXphbiB1biBtw6l0b2RvIHRyYWRpY2lvbmFsIHF1ZSBjb25zaXN0ZSBlbiBhdGFyIGEgbGEgY2ludHVyYSB1bmEgY3VlcmRhLCB1bmEgcmFtYSwgbyB1biBwYXBlbGl0byBjb24gbyBzaW4gZnJhc2VzIGRlbCBDb3LDoW4uJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5VbiBwcm95ZWN0byBhbGVtw6FuIGZhY2lsaXRhIGFudGljb25jZXB0aXZvcyBkZSBmb3JtYSBncmF0dWl0YSBhIG11amVyZXMgZGUgbcOhcyBkZSAyMCBhw7FvcyBjb24gaW5ncmVzb3MgYmFqb3MuPC9hPidcbiAgICAgICdHVE0nOiAnPGEgaHJlZj1cImh0dHA6Ly9idWZmLmx5LzJ0YVl3Y29cIiB0YXJnZXQ9XCJfYmxhbmtcIj5MYSByZWxpZ2nDs24gaW5mbHV5ZSBlbiBsYSBlZHVjYWNpw7NuIHNleHVhbCBkZSBsb3MgasOzdmVuZXMgZ3VhdGVtYWx0ZWNvcy48L2E+J1xuICAgICAgJ0lTUic6ICdFbiBsb3Mgc2VjdG9yZXMganVkw61vcyBtw6FzIG9ydG9kb3hvcywgc29sbyBwdWVkZW4gdXNhcnNlIGxvcyBhbnRpY29uY2VwdGl2b3Mgc2kgZWwgcmFiaW5vIGRhIHN1IHBlcm1pc28gYSBsYSBtdWplci4nXG4gICAgICAnSlBOJzogJ0phcMOzbiwgYXVucXVlIHNlIGVuY3VlbnRyYSBlbiBlbCBncnVwbyBkZSBwYcOtc2VzIGNvbiByZW50YSBhbHRhLCBlcyBsYSBleGNlcGNpw7NuOiBsYXMgbmVjZXNpZGFkZXMgbm8gY3ViaWVydGFzIGNvbiBhbnRpY29uY2VwdGl2b3MgZXN0w6EgYWwgbml2ZWwgZGUgcGHDrXNlcyBjb24gcmVudGFzIGJhamFzLidcbiAgICAgICdQUksnOiAnRWwgOTUlIGRlIG11amVyZXMgcXVlIHV0aWxpemFuIGFudGljb25jZXB0aXZvcyBlbiBDb3JlYSBkZWwgTm9ydGUgaGFuIGVsZWdpZG8gZWwgRElVLiBTZSB0cmF0YSBkZWwgbWF5b3IgcG9yY2VudGFqZSBkZSB1c28gYSBuaXZlbCBtdW5kaWFsLidcbiAgICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiIHRhcmdldD1cIl9ibGFua1wiPkVsIGdvYmllcm5vIGhvbGFuZMOpcyBsYW56YSBlbCBwcm95ZWN0byA8aT5TaGUgRGVjaWRlczwvaT4gcGFyYSBjb250cmFycmVzdGFyIGxhIHJldGlyYWRhIGRlIGZvbmRvcyBwYXJhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIGRlIFRydW1wLjwvYT4nXG4gICAgICAnUEVSJzogJzxhIGhyZWY9XCJodHRwczovL2ludGVyYWN0aXZlLnF1aXB1LXByb2plY3QuY29tLyMvZXMvcXVpcHUvaW50cm9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbiBsYSDDqXBvY2EgZGUgbG9zIDkwLCBkdXJhbnRlIGVsIGdvYmllcm5vIGRlIEZ1amltb3JpLCBtw6FzIGRlIDI1MC4wMDAgbXVqZXJlcyBmdWVyb24gZXN0ZXJpbGl6YWRhcyBzaW4gc3UgY29uc2VudGltaWVudG8uPC9hPidcbiAgICAgICdQSEwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9qdWwvMTAvaG93LWJpdHRlci1oZXJicy1hbmQtYm90Y2hlZC1hYm9ydGlvbnMta2lsbC10aHJlZS13b21lbi1hLWRheS1pbi10aGUtcGhpbGlwcGluZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj4gRW4gdW4gcGHDrXMgZG9uZGUgZWwgYWJvcnRvIGRlbCBlc3TDoSBwcm9oaWJpZG8sIHRyZXMgbXVqZXJlcyBtdWVyZW4gYWwgZMOtYSBwb3IgY29tcGxpY2FjaW9uZXMgZGVyaXZhZGFzIGRlIGludGVydmVuY2lvbmVzIGlsZWdhbGVzLjwvYT4nXG4gICAgICAnUE9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5hbW5lc3R5Lm9yZy9lbi9sYXRlc3QvbmV3cy8yMDE3LzA2L3BvbGFuZC1lbWVyZ2VuY3ktY29udHJhY2VwdGlvbi1yZXN0cmljdGlvbnMtY2F0YXN0cm9waGljLWZvci13b21lbi1hbmQtZ2lybHMvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgR29iaWVybm8gcG9sYWNvIGRhIHVuIHBhc28gYXRyw6FzIHkgc2UgY29udmllcnRlIGVuIGVsIMO6bmljbyBwYcOtcyBkZSBsYSBVbmnDs24gRXVyb3BlYSBkb25kZSBsYSBwYXN0aWxsYSBkZWwgZMOtYSBkZXNwdcOpcyBlc3TDoSBzdWpldGEgYSBwcmVzY3JpcGNpw7NuLjwvYT4nXG4gICAgICAnU1NEJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvbWF5LzI1L2V2ZXJ5LXllYXItaS1naXZlLWJpcnRoLXdhci1kcml2aW5nLWNvbnRyYWNlcHRpb24tY3Jpc2lzLXN1ZGFuLW51YmEtbW91bnRhaW5zXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TGEgZ3VlcnJhIGVuIFN1ZMOhbiBlc3TDoSBjcmVhbmRvIHVuYSBjcmlzaXMgZW4gZWwgYWNjZXNvIGEgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5NYWRyaWQgZXMgbGEgw7puaWNhIGNvbXVuaWRhZCBxdWUgbm8gZmluYW5jaWEgYW50aWNvbmNlcHRpdm9zIGNvbiBzdXMgZm9uZG9zLjwvYT4nXG4gICAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FcmRvZ2FuIGRlY2xhcmEgcXVlIGxhIHBsYW5pZmljYWNpw7NuIGZhbWlsaWFyIG5vIGVzIHBhcmEgbG9zIG11c3VsbWFuZXMuPC9hPidcbiAgICAgICdVR0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm5ld3Zpc2lvbi5jby51Zy9uZXdfdmlzaW9uL25ld3MvMTQ1ODg4Mi91Z2FuZGEtZmFjaW5nLTE1MC1taWxsaW9uLWNvbmRvbS1zaG9ydGZhbGxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbiAyMDE3LCBlbCBNaW5pc3RlcmlvIGRlIFNhbHVkIGRlIFVnYW5kYSBkZWNsYXJhYmEgdW4gZGVzYWJhc3RlY2ltaWVudG8gZGUgMTUwIG1pbGxvbmVzIGRlIHByZXNlcnZhdGl2b3MgbWFzY3VsaW5vcy48L2E+J1xuICAgICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RW4gSXJsYW5kYSBlcyBpbGVnYWwgYWJvcnRhciBhIG5vIHNlciBxdWUgaGF5YSB1biByaWVzZ28gcmVhbCBkZSBzYWx1ZCBwYXJhIGxhIG1hZHJlLjwvYT4nXG4gICAgICAnVVNBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE4LzAxLzE4L3VzL2hlYWx0aC1jYXJlLW9mZmljZS1hYm9ydGlvbi1jb250cmFjZXB0aW9uLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5UcnVtcCBkYSBhIGxvcyBtw6lkaWNvcyBsaWJlcnRhZCBwYXJhIG5lZ2Fyc2UgYSByZWFsaXphciBwcm9jZWRpbWllbnRvcyBlbiBjb250cmEgZGUgc3VzIGNyZWVuY2lhcyByZWxpZ2lvc2FzLCBjb21vIGVsIGFib3J0by48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TGEgZXNjYXNleiB5IGVsIHByZWNpbyBlbGV2YWRvIGRlIGxvcyBhbnRpY29uY2VwdGl2b3MgZW4gVmVuZXp1ZWxhIGluZmx1eWUgZW4gZWwgYXVtZW50byBkZSBlbWJhcmF6b3Mgbm8gZGVzZWFkb3MuPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VW4gcHJveWVjdG8gZW4gWmFtYmlhICB1bmUgbGEgbWFuaWN1cmEgeSBsb3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgJ2VuJzpcbiAgICAgICdBTEInOiAnV2l0aGRyYXduIGlzIHRoZSBtb3N0IHVzZWQgY29udHJhY2VwdGl2ZSBtZXRob2QgYnkgQWxiYW5pYW4gd29tZW4uIEZ1cnRoZXJtb3JlLCBpdCBpcyB0aGUgc2Vjb25kIGNvdW50cnkgd2hlcmUgdGhlIG9wcG9zaXRpb24gb2YgdGhlIHJlc3BvbmRlbnQsIHRoZSBwYXJ0bmVyIG9yIHRoZSByZWxpZ2lvbiB0byB1c2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIGlzIHRoZSBtYWluIGJhcnJpZXIgZm9yIHVzaW5nIHRoZW0gd2hlbiB0aGV5IGFyZSBuZWVkZWQuJ1xuICAgICAgJ0FSRyc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY2xhcmluLmNvbS9zb2NpZWRhZC9jYW1wYW5hLWxleS1hYm9ydG8tY29tZW56by0yMDA1LXByb3llY3RvLXByZXNlbnRvLXZlY2VzXzBfQkp2ZGkwblB6Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BcHByb3hpbWF0ZWx5IGZpdmUgdGhvdXNhbmQgd29tZW4gbWFyY2hlZCBpbiBGZWJydWFyeSAyMDE4IGluIGZyb250IG9mIHRoZSBBcmdlbnRpbmUgQ29uZ3Jlc3MgdG8gZGVtYW5kIHRoZSBsZWdhbGl6YXRpb24gb2YgYWJvcnRpb24uIDwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiIHRhcmdldD1cIl9ibGFua1wiPk5hdHVyYWwgbWV0aG9kcyBvZiBjb250cmFjZXB0aW9uIG9uIHRoZSByaXNlIGluIEF1c3RyYWxpYSwgYWNjb3JkaW5nIHRvIGFuIGludmVzdGlnYXRpb24gb2YgTW9uYXNoIFVuaXZlcnNpdHkuIDwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5CZWxnaXVtIGhhdmUgZG9uYXRlZCAxMCBtaWxsaW9uIGV1cm9zIHRvIHRoZSA8aT5TaGUgRGVjaWRlczwvaT4gcHJveWVjdCwgbGF1bmNoZWQgYnkgdGhlIER1dGNoIGdvdmVybm1lbnQgdG8gYm9vc3QgY29udHJhY2VwdGlvbiBpbiBkZXZlbG9waW5nIGNvdW50cmllcy4gPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Qm9saXZpYVxcJ3MgcGhhcm1hY2llcyBoYXZlIGRldmVsb3BlZCBhIHNlY3JldCBjb2RlIHRvIGFzayBmb3IgY29uZG9tcyBhbmQgdGhlcmVmb3JlLCB0byBhdm9pZCBzdGlnbWEgYWJvdXQgYnV5aW5nIHRoZW0uPC9hPidcbiAgICAgICdDSE4nOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTcvMDEvMDcvd29ybGQvYXNpYS9hZnRlci1vbmUtY2hpbGQtcG9saWN5LW91dHJhZ2UtYXQtY2hpbmFzLW9mZmVyLXRvLXJlbW92ZS1pdWRzLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BZnRlciBvbmUgY2hpbGQgcG9saWNpeSwgb3V0cmFnZSBhdCBDaGluYVxcJ3Mgb2ZmZXIgdG8gcmVtb3ZlIElVRHMuPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgU2FsdmFkb3IgaXMgb25lIG9mIHNpeCBjb3VudHJpZXMgd2hlcmUgYWJvcnRpb24gaXMgYmFubmVkIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLCBhbmQgd29tZW4gd2hvIHVuZGVyZ28gaXQgY291bGQgZmFjZSBwcmlzb24gPC9hPidcbiAgICAgICdGSU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuaGVsc2lua2l0aW1lcy5maS9maW5sYW5kL2ZpbmxhbmQvbmV3cy9kb21lc3RpYy8xNTI3MS1oZWxzaW5raS10by1vZmZlci15ZWFyLXMtd29ydGgtb2YtY29udHJhY2VwdGl2ZS1waWxscy10by11bmRlci0yNS15ZWFyLW9sZHMuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPkhlbHNpbmtpIHRvIG9mZmVyIHllYXLigJlzIHdvcnRoIG9mIGNvbnRyYWNlcHRpdmUgcGlsbHMgdG8gdW5kZXIgMjUteWVhci1vbGRzLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiIHRhcmdldD1cIl9ibGFua1wiPkZyZW5jaCB3b21lbiBvcHQgZm9yIGFsdGVybmF0aXZlcyBhcyBQaWxsIHVzZSBkcm9wcy48L2E+J1xuICAgICAgJ0dNQic6ICdJbiBUaGUgR2FtYmlhLCBtYW55IHdvbWVuIHVzZSBhIHRyYWRpdGlvbmFsIG1ldGhvZCB0aGF0IGludm9sdmVzIHR5aW5nIGEgcm9wZSwgYSBicmFuY2ggb3IgYSBwaWVjZSBvZiBwYXBlciBhcm91bmQgdGhlIHdhaXN0IHdpdGggLW9yIHdpdGhvdXQtIHBocmFzZXMgZnJvbSB0aGUgS29yYW4gaW4gaXQuJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BIHRyaWFsIHNjaGVtZSBpbiBHZXJtYW55IGlzIGhlbHBpbmcgd29tZW4gb24gbG93IGluY29tZXMgdG8gYXZvaWQgc2FjcmlmaWNpbmcgdGhlaXIgY29udHJhY2VwdGlvbi48L2E+J1xuICAgICAgJ0dUTSc6ICc8YSBocmVmPVwiaHR0cDovL2J1ZmYubHkvMnRhWXdjb1wiIHRhcmdldD1cIl9ibGFua1wiPlJlbGlnaW9uIGhhcyBhIG1ham9yIGluZmx1ZW5jZSBpbiBzZXh1YWwgZWR1Y2F0aW9uIG9mIEd1YXRlbWFsYSB5b3VuZyBwZW9wbGUuPC9hPidcbiAgICAgICdJU1InOiAnSW4gdWx0cmEgb3J0aG9kb3gganVkYWlzbSwgY29udHJhY2VwdGl2ZSB1c2UgaXMgb25seSBwZXJtaXR0ZWQgaWYgdGhlIHJhYmJpIGdpdmVzIHByZXZpb3VzIHBlcm1pc3Npb24gdG8gdGhlIHdvbWFuLidcbiAgICAgICdKUE4nOiAnSmFwYW4sIGV2ZW4gaWYgaXQgaXMgcGFydCBvZiB0aGUgZ3JvdXAgb2YgY291bnRyaWVzIHdpdGggaGlnaCBpbmNvbWUsIGhhcyB1bm1ldCBuZWVkcyBmb3IgY29udHJhY2VwdGlvbiBhdCB0aGUgbGV2ZWwgb2YgY291bnRyaWVzIHdpdGggbG93IGluY29tZS4nXG4gICAgICAnUFJLJzogJzk1JSBvZiB3b21lbiB3aG8gdXNlIGNvbnRyYWNlcHRpdmUgbWV0aG9kcyBpbiBOb3J0aCBLb3JlYSBoYXZlIGNob3NlbiB0byB1c2UgSVVEcy4gSXQgaXMgdGhlIGhpZ2hlc3QgcGVyY2VudGFnZSBvZiB1c2Ugb2YgdGhpcyBtZXRob2Qgd29ybGR3aWRlLidcbiAgICAgICdOTEQnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHV0Y2huZXdzLm5sL25ld3MvYXJjaGl2ZXMvMjAxNy8wMy9zaGUtZGVjaWRlcy1mb3VuZGF0aW9uLWJyaW5ncy1pbi1lMTgxbS1mb3ItZmFtaWx5LXBsYW5uaW5nLWNhbXBhaWduL1wiIHRhcmdldD1cIl9ibGFua1wiPkR1dGNoIGluaXRpYXRpdmUgYnJpbmdzIGluIOKCrDE4MW0gZm9yIGZhbWlseSBwbGFubmluZyBjYW1wYWlnbi48L2E+J1xuICAgICAgJ1BFUic6ICc8YSBocmVmPVwiaHR0cHM6Ly9pbnRlcmFjdGl2ZS5xdWlwdS1wcm9qZWN0LmNvbS8jL2VzL3F1aXB1L2ludHJvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SW4gdGhlIDE5OTBzLCBBbGJlcnRvIEZ1amltb3JpLCBmb3JtZXIgcHJlc2lkZW50IG9mIFBlcnUsIGxhdW5jaGVkIGEgbmV3IGZhbWlseSBwbGFubmluZyBwcm9ncmFtbWUgdGhhdCByZXN1bHRlZCBpbiB0aGUgc3RlcmlsaXNhdGlvbiBvZiAyNzIsMDI4IHdvbWVuIGFuZCAyMiwwMDQgbWVuIGluIG9ubHkgNCB5ZWFycy48L2E+J1xuICAgICAgJ1BITCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L2p1bC8xMC9ob3ctYml0dGVyLWhlcmJzLWFuZC1ib3RjaGVkLWFib3J0aW9ucy1raWxsLXRocmVlLXdvbWVuLWEtZGF5LWluLXRoZS1waGlsaXBwaW5lc1wiIHRhcmdldD1cIl9ibGFua1wiPiBIb3cgYml0dGVyIGhlcmJzIGFuZCBib3RjaGVkIGFib3J0aW9ucyBraWxsIHRocmVlIHdvbWVuIGEgZGF5IGluIHRoZSBQaGlsaXBwaW5lcy48L2E+J1xuICAgICAgJ1BPTCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuYW1uZXN0eS5vcmcvZW4vbGF0ZXN0L25ld3MvMjAxNy8wNi9wb2xhbmQtZW1lcmdlbmN5LWNvbnRyYWNlcHRpb24tcmVzdHJpY3Rpb25zLWNhdGFzdHJvcGhpYy1mb3Itd29tZW4tYW5kLWdpcmxzL1wiIHRhcmdldD1cIl9ibGFua1wiPlBvbGlzaCBHb3Zlcm5tZW50IHRha2VzIGEgc3RlcCBiYWNrIGluIHRoZSBhY2Nlc3MgdG8gdGhlIFwibW9ybmluZy1hZnRlclwiIHBpbGwgYW5kIGl0IGJlY29tZXMgdGhlIG9ubHkgRXVyb3BlYW4gY291bnRyeSB3aGVyZSB3b21lbiBuZWVkIGEgcHJlc2NyaXB0aW9uIGZvciB0aGUgdXNlIG9mIHRoaXMgY29udHJhY2VwdGl2ZSBtZXRob2QuPC9hPidcbiAgICAgICdTU0QnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9tYXkvMjUvZXZlcnkteWVhci1pLWdpdmUtYmlydGgtd2FyLWRyaXZpbmctY29udHJhY2VwdGlvbi1jcmlzaXMtc3VkYW4tbnViYS1tb3VudGFpbnNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5cXCdFdmVyeSB5ZWFyLCBJIGdpdmUgYmlydGhcXCc6IHdoeSB3YXIgaXMgZHJpdmluZyBhIGNvbnRyYWNlcHRpb24gY3Jpc2lzIGluIFN1ZGFuLjwvYT4nXG4gICAgICAnRVNQJzogJzxhIGhyZWY9XCJodHRwOi8vY2FkZW5hc2VyLmNvbS9lbWlzb3JhLzIwMTcvMDkvMTkvcmFkaW9fbWFkcmlkLzE1MDU4NDI5MzJfMTMxMDMxLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5NYWRyaWQgaXMgdGhlIG9ubHkgcmVnaW9uYWwgZ292ZXJubWVudCB0aGF0IGRvZXMgbm90IGZpbmFuY2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIHdpdGggaXRzIGZ1bmRzLjwvYT4nXG4gICAgICAnVFVSJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbmV3cy93b3JsZC1ldXJvcGUtMzY0MTMwOTdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5UdXJrZXlcXCdzIEVyZG9nYW4gd2FybnMgTXVzbGltcyBhZ2FpbnN0IGJpcnRoIGNvbnRyb2wuPC9hPidcbiAgICAgICdVR0EnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm5ld3Zpc2lvbi5jby51Zy9uZXdfdmlzaW9uL25ld3MvMTQ1ODg4Mi91Z2FuZGEtZmFjaW5nLTE1MC1taWxsaW9uLWNvbmRvbS1zaG9ydGZhbGxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5JbiAyMDE3LCBVZ2FuZGEgZmFjZWQgYSAxNTAgbWlsbGlvbnMgbWFsZSBjb25kb21zIHNob3J0ZmFsbC48L2E+J1xuICAgICAgJ0dCUic6ICc8YSBocmVmPWh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SXJpc2ggcmVmZXJlbmR1bSBvbiBhYm9ydGlvbiByZWZvcm0gdG8gYmUgaGVsZCBieSBlbmQgb2YgTWF5IDIwMTg8L2E+J1xuICAgICAgJ1VTQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxOC8wMS8xOC91cy9oZWFsdGgtY2FyZS1vZmZpY2UtYWJvcnRpb24tY29udHJhY2VwdGlvbi5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VHJ1bXAgZ2l2ZXMgaGVhbHRoIHdvcmtlcnMgbmV3IHJlbGlnaW91cyBsaWJlcnR5IHByb3RlY3Rpb25zLjwvYT4nXG4gICAgICAnVkVOJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmJiYy5jb20vbXVuZG8vbm90aWNpYXMtYW1lcmljYS1sYXRpbmEtNDI2MzU0MTJcIiB0YXJnZXQ9XCJfYmxhbmtcIj5UaGUgc2hvcnRhZ2UgYW5kIGhpZ2ggcHJpY2Ugb2YgY29udHJhY2VwdGl2ZXMgaW4gVmVuZXp1ZWxhIGluZmx1ZW5jZXMgdGhlIGluY3JlYXNlIGluIHVud2FudGVkIHByZWduYW5jaWVzPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SW4gWmFtYmlhLCBhIHJhZGljYWwgbmV3IGFwcHJvYWNoIHRvIGNvbnRyYWNlcHRpb24gaXMgZ2l2aW5nIGFkb2xlc2NlbnQgZ2lybHMgdGhlIGluZm9ybWF0aW9uIGFuZCBzZXJ2aWNlcyBvZiBjb250cmFjZXB0aW9uIHdoaWxlIGRvaW5nIHRoZSBtYW5pY3VyZS48L2E+J1xuXG5cbiAgY29uc3RydWN0b3I6IChsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJfY291bnRyeSwgbWV0aG9kc19rZXlzLCBtZXRob2RzX25hbWVzLCBtZXRob2RzX2Roc19uYW1lcywgcmVhc29uc19uYW1lcywgcmVhc29uc19kaHNfbmFtZXMsIHB5bSkgLT5cblxuICAgIEBzZW50ZW5jZXMgPSBAc2VudGVuY2VzW2xhbmddXG5cbiAgICBAZGF0YSA9IFxuICAgICAgdXNlOiAgICAgICAgZGF0YV91c2VcbiAgICAgIHVubWV0bmVlZHM6IGRhdGFfdW5tZXRuZWVkc1xuICAgICAgcmVhc29uczogICAgZGF0YV9yZWFzb25zXG5cbiAgICBAbWV0aG9kc0tleXMgICAgICA9IG1ldGhvZHNfa2V5c1xuICAgIEBtZXRob2RzTmFtZXMgICAgID0gbWV0aG9kc19uYW1lc1xuICAgIEBtZXRob2RzREhTTmFtZXMgID0gbWV0aG9kc19kaHNfbmFtZXNcbiAgICBAcmVhc29uc05hbWVzICAgICA9IHJlYXNvbnNfbmFtZXNcbiAgICBAcmVhc29uc0RIU05hbWVzICA9IHJlYXNvbnNfZGhzX25hbWVzXG5cbiAgICBAcHltID0gcHltXG5cbiAgICBAJGFwcCA9ICQoJyNjb250cmFjZXB0aXZlcy1hcHAnKVxuXG4gICAgQCRhcHAuZmluZCgnLnNlbGVjdC1jb3VudHJ5JylcbiAgICAgIC5zZWxlY3QyKClcbiAgICAgIC5jaGFuZ2UgQG9uU2VsZWN0Q291bnRyeVxuICAgICAgLnZhbCB1c2VyX2NvdW50cnkuY29kZVxuICAgICAgLnRyaWdnZXIgJ2NoYW5nZSdcblxuICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykuY2xpY2sgQG9uU2VsZWN0RmlsdGVyXG5cbiAgICBAJGFwcC5jc3MoJ29wYWNpdHknLDEpXG5cblxuICBvblNlbGVjdENvdW50cnk6IChlKSA9PlxuICAgIEBjb3VudHJ5X2NvZGUgPSAkKGUudGFyZ2V0KS52YWwoKVxuXG4gICAgdXNlICAgICAgICAgICA9IG51bGxcbiAgICBtZXRob2QgICAgICAgID0gbnVsbFxuICAgIG1ldGhvZF92YWx1ZSAgPSBudWxsXG4gICAgdW5tZXRuZWVkcyAgICA9IG51bGxcbiAgICByZWFzb24gICAgICAgID0gbnVsbFxuICAgIHJlYXNvbl92YWx1ZSAgPSBudWxsXG5cbiAgICAjIGhpZGUgZmlsdGVycyAmIGNsZWFyIGFjdGl2ZSBidG5zXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykuaGlkZSgpLmZpbmQoJy5idG4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAjIGhpZGUgZmlsdGVycyByZXN1bHRzXG4gICAgJCgnLmNvbnRyYWNlcHRpdmVzLWZpbHRlcicpLmhpZGUoKVxuXG4gICAgaWYgQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV1cbiAgICAgICMgc2V0IGRhdGEgeWVhclxuICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sIEBkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdLnllYXJcbiAgICAgICMgbG9hZCBjb3VudHJ5IGRocyBkYXRhXG4gICAgICBkMy5jc3YgJCgnYm9keScpLmRhdGEoJ2Jhc2V1cmwnKSsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy8nK0BkaHNfY291bnRyaWVzW0Bjb3VudHJ5X2NvZGVdLm5hbWUrJ19hbGwuY3N2JywgKGVycm9yLCBkYXRhKSA9PlxuICAgICAgICBkID0gZGF0YVswXVxuICAgICAgICAjIHNldHVwIGRhdGFcbiAgICAgICAgQHNldEFwcEl0ZW1EYXRhIEAkYXBwLCAxMDAqKGQubi1kLm5vdF91c2luZ19jb250cmFjZXB0aW9uKS9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAgICMgc2hvdyBmaWx0ZXJzXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycycpLnNob3coKVxuICAgICAgICAjIHVwZGF0ZSBpZnJhbWUgaGVpZ2h0XG4gICAgICAgIGlmIEBweW1cbiAgICAgICAgICBAcHltLnNlbmRIZWlnaHQoKVxuICAgIGVsc2VcbiAgICAgICMgc2V0IGRhdGEgeWVhclxuICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sICcyMDE1LTE2J1xuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgY29uc29sZS5sb2cgY291bnRyeVVzZVxuICAgICAgaWYgY291bnRyeVVzZSBhbmQgY291bnRyeVVzZVswXVxuICAgICAgICBpZiBjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddICE9ICcwJ1xuICAgICAgICAgIHVzZSAgICAgICAgICAgPSBwYXJzZUZsb2F0KGNvdW50cnlVc2VbMF1bJ0FueSBtb2Rlcm4gbWV0aG9kJ10pICsgcGFyc2VGbG9hdChjb3VudHJ5VXNlWzBdWydBbnkgdHJhZGl0aW9uYWwgbWV0aG9kJ10pXG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IEBtZXRob2RzS2V5cy5tYXAgKGtleSwgaSkgPT4geyduYW1lJzogQG1ldGhvZHNOYW1lc1tpXSwgJ3ZhbHVlJzogK2NvdW50cnlVc2VbMF1ba2V5XX1cbiAgICAgICAgY291bnRyeV9tZXRob2RzID0gY291bnRyeV9tZXRob2RzLnNvcnQgKGEsYikgLT4gYi52YWx1ZS1hLnZhbHVlXG4gICAgICAgIG1ldGhvZCAgICAgICAgICA9IGNvdW50cnlfbWV0aG9kc1swXS5uYW1lXG4gICAgICAgIG1ldGhvZF92YWx1ZSAgICA9IGNvdW50cnlfbWV0aG9kc1swXS52YWx1ZVxuICAgICAgIyBVbm1ldG5lZWRzXG4gICAgICBjb3VudHJ5VW5tZXRuZWVkcyA9IEBkYXRhLnVubWV0bmVlZHMuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgaWYgY291bnRyeVVubWV0bmVlZHMgYW5kIGNvdW50cnlVbm1ldG5lZWRzWzBdXG4gICAgICAgICMgdXNlIHN1cnZleSBkYXRhIGlmIGF2YWlsYWJsZSwgdXNlIGVzdGltYXRlZCBpZiBub3RcbiAgICAgICAgdW5tZXRuZWVkcyA9IGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSBlbHNlIGNvdW50cnlVbm1ldG5lZWRzWzBdWydlc3RpbWF0ZWQnXSBcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHVwZGF0ZSBpZnJhbWUgaGVpZ2h0XG4gICAgICBpZiBAcHltXG4gICAgICAgIEBweW0uc2VuZEhlaWdodCgpXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7c2Nyb2xsVG9wOiBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5vZmZzZXQoKS50b3AtMTV9LCA0MDBcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqKGQubi1kLm5vdF91c2luZ19jb250cmFjZXB0aW9uKS9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG4gICAgICAgICAgIyBVcGRhdGUgaWZyYW1lIGhlaWdodFxuICAgICAgICAgIGlmIEBweW1cbiAgICAgICAgICAgIEBweW0uc2VuZEhlaWdodCgpXG5cblxuICBzZXRBcHBJdGVtRGF0YTogKCRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWUsIHNlbnRlbmNlKSAtPlxuXG4gICAgI2NvbnNvbGUubG9nICdzZXRBcHBJdGVtRGF0YScsICRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgIGlmIHVzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK3VzZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcblxuICAgIGlmIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCttZXRob2RfdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuaGlkZSgpXG5cbiAgICBpZiB1bm1ldG5lZWRzXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK3VubWV0bmVlZHMpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcblxuICAgIGlmIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24nKS5odG1sIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24tdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK3JlYXNvbl92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcblxuICAgIGlmIHNlbnRlbmNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1zZW50ZW5jZScpLmh0bWwoc2VudGVuY2UpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaGlkZSgpXG5cbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cbiAgXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJpbXBsYW50ZVwiXG4gICAgICBcImlueWVjdGFibGVcIlxuICAgICAgXCJww61sZG9yYVwiXG4gICAgICBcImNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiY29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIm3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJhbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIm90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiZmVtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgXCJtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJpbXBsYW50XCJcbiAgICAgIFwiaW5qZWN0YWJsZVwiXG4gICAgICBcInBpbGxcIlxuICAgICAgXCJtYWxlIGNvbmRvbVwiXG4gICAgICBcImZlbWFsZSBjb25kb21cIlxuICAgICAgXCJ2YWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiZW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJvdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJzEnOiBcInDDrWxkb3JhXCJcbiAgICAgICcyJzogXCJESVVcIlxuICAgICAgJzMnOiBcImlueWVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmTDs25cIlxuICAgICAgJzYnOiBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICAnNyc6IFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICAnOCc6IFwiYWJzdGluZW5jaWEgcGVyacOzZGljYVwiXG4gICAgICAnOSc6IFwibWFyY2hhIGF0csOhc1wiXG4gICAgICAnMTAnOiBcIm90cm9zXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudGVcIlxuICAgICAgJzEzJzogXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgICcxNyc6IFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgJ2VuJzpcbiAgICAgICcxJzogXCJwaWxsXCJcbiAgICAgICcyJzogXCJJVURcIlxuICAgICAgJzMnOiBcImluamVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmRvbVwiXG4gICAgICAnNic6IFwiZmVtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgJzcnOiBcIm1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICAnOCc6IFwicGVyaW9kaWMgYWJzdGluZW5jZVwiXG4gICAgICAnOSc6IFwid2l0aGRyYXdhbFwiXG4gICAgICAnMTAnOiBcIm90aGVyXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudFwiXG4gICAgICAnMTMnOiBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgICcxNyc6IFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG5cblxuICAjIyNcbiAgbWV0aG9kc19pY29ucyA9IFxuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJJVURcIjogJ2RpdSdcbiAgICBcIkltcGxhbnRcIjogbnVsbFxuICAgIFwiSW5qZWN0YWJsZVwiOiAnaW5qZWN0YWJsZSdcbiAgICBcIlBpbGxcIjogJ3BpbGwnXG4gICAgXCJNYWxlIGNvbmRvbVwiOiAnY29uZG9tJ1xuICAgIFwiRmVtYWxlIGNvbmRvbVwiOiBudWxsXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiOiBudWxsXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiOiBudWxsXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiOiBudWxsXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiOiBudWxsXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCI6ICd0cmFkaXRpb25hbCdcbiAgIyMjXG5cbiAgcmVhc29uc19uYW1lcyA9IFxuICAgICdlcyc6XG4gICAgICBcImFcIjogXCJubyBlc3TDoW4gY2FzYWRhc1wiXG4gICAgICBcImJcIjogXCJubyB0aWVuZW4gc2V4b1wiXG4gICAgICBcImNcIjogXCJ0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZVwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuXCJcbiAgICAgIFwiZVwiOiBcInNvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXNcIlxuICAgICAgXCJmXCI6IFwiYW1lbm9ycmVhIHBvc3RwYXJ0b1wiXG4gICAgICBcImdcIjogXCJlc3TDoW4gZGFuZG8gZWwgcGVjaG9cIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RhXCJcbiAgICAgIFwiaVwiOiBcImxhIG11amVyIHNlIG9wb25lXCJcbiAgICAgIFwialwiOiBcImVsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZVwiXG4gICAgICBcImtcIjogXCJvdHJvcyBzZSBvcG9uZW5cIiAgICAgICAgXG4gICAgICBcImxcIjogXCJwcm9oaWJpY2nDs24gcmVsaWdpb3NhXCIgIFxuICAgICAgXCJtXCI6IFwibm8gY29ub2NlIGxvcyBtw6l0b2Rvc1wiXG4gICAgICBcIm5cIjogXCJubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3NcIlxuICAgICAgXCJvXCI6IFwicHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgXCJwXCI6IFwibWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcy9wcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiIFxuICAgICAgXCJxXCI6IFwiZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvc1wiXG4gICAgICBcInJcIjogXCJjdWVzdGFuIGRlbWFzaWFkb1wiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzb1wiXG4gICAgICBcInRcIjogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgICBcInVcIjogXCJlbCBtw6l0b2RvIGVsZWdpZG8gbm8gZXN0w6EgZGlzcG9uaWJsZVwiXG4gICAgICBcInZcIjogXCJubyBoYXkgbcOpdG9kb3MgZGlzcG9uaWJsZXNcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3Ryb3NcIlxuICAgICAgXCJ6XCI6IFwibm8gbG8gc8OpXCJcbiAgICAnZW4nOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiXG4gICAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiXG4gICAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIlxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKSJ3MgcHJvY2Vzc2VzXCJcbiAgICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gIHJlYXNvbnNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAndjNhMDhhJzogJ25vIGVzdMOhbiBjYXNhZGFzJ1xuICAgICAgJ3YzYTA4Yic6ICdubyB0aWVuZW4gc2V4bydcbiAgICAgICd2M2EwOGMnOiAndGllbmVuIHNleG8gaW5mcmVjdWVudGUnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs24nXG4gICAgICAndjNhMDhlJzogJ3NvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXMnXG4gICAgICAndjNhMDhmJzogJ2FtZW5vcnJlYSBwb3N0cGFydG8nXG4gICAgICAndjNhMDhnJzogJ2VzdMOhbiBkYW5kbyBlbCBwZWNobydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RhJ1xuICAgICAgJ3YzYTA4aSc6ICdsYSBtdWplciBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGonOiAnZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4ayc6ICdvdHJvcyBzZSBvcG9uZW4nICAgICAgICBcbiAgICAgICd2M2EwOGwnOiAncHJvaGliaWNpw7NuIHJlbGlnaW9zYSdcbiAgICAgICd2M2EwOG0nOiAnbm8gY29ub2NlIGxvcyBtw6l0b2RvcydcbiAgICAgICd2M2EwOG4nOiAnbm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zJ1xuICAgICAgJ3YzYTA4byc6ICdwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZCdcbiAgICAgICd2M2EwOHAnOiAnbWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcydcbiAgICAgICd2M2EwOHEnOiAnZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvcydcbiAgICAgICd2M2EwOHInOiAnY3Vlc3RhbiBkZW1hc2lhZG8nXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudGVzIHBhcmEgc3UgdXNvJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICdlbic6IFxuICAgICAgJ3YzYTA4YSc6ICdub3QgbWFycmllZCdcbiAgICAgICd2M2EwOGInOiAnbm90IGhhdmluZyBzZXgnXG4gICAgICAndjNhMDhjJzogJ2luZnJlcXVlbnQgc2V4J1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2FsL2h5c3RlcmVjdG9teSdcbiAgICAgICd2M2EwOGUnOiAnc3ViZmVjdW5kL2luZmVjdW5kJ1xuICAgICAgJ3YzYTA4Zic6ICdwb3N0cGFydHVtIGFtZW5vcnJoZWljJ1xuICAgICAgJ3YzYTA4Zyc6ICdicmVhc3RmZWVkaW5nJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGljJ1xuICAgICAgJ3YzYTA4aSc6ICdyZXNwb25kZW50IG9wcG9zZWQnXG4gICAgICAndjNhMDhqJzogJ2h1c2JhbmQvcGFydG5lciBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4ayc6ICdvdGhlcnMgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGwnOiAncmVsaWdpb3VzIHByb2hpYml0aW9uJ1xuICAgICAgJ3YzYTA4bSc6ICdrbm93cyBubyBtZXRob2QnXG4gICAgICAndjNhMDhuJzogJ2tub3dzIG5vIHNvdXJjZSdcbiAgICAgICd2M2EwOG8nOiAnaGVhbHRoIGNvbmNlcm5zJ1xuICAgICAgJ3YzYTA4cCc6ICdmZWFyIG9mIHNpZGUgZWZmZWN0cydcbiAgICAgICd2M2EwOHEnOiAnbGFjayBvZiBhY2Nlc3MvdG9vIGZhcidcbiAgICAgICd2M2EwOHInOiAnY29zdHMgdG9vIG11Y2gnXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudCB0byB1c2UnXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZlcmVzIHdpdGggdGhlIGJvZHkncyBwcm9jZXNzZXNcIlxuXG5cbiAgc2V0TG9jYXRpb24gPSAobG9jYXRpb24sIGNvdW50cmllcykgLT5cbiAgICBpZiBsb2NhdGlvblxuICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgZWxzZVxuICAgICAgbG9jYXRpb24gPSB7fVxuXG4gICAgdW5sZXNzIGxvY2F0aW9uLmNvZGVcbiAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgdXNlckNvdW50cnkubmFtZSA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdFc3Bhw7FhJyBlbHNlICdTcGFpbidcblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICBweW1DaGlsZCA9IG5ldyBweW0uQ2hpbGQoKVxuXG4gICMgTG9hZCBsb2NhdGlvblxuICBkMy5qc29uICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nLCAoZXJyb3IsIGxvY2F0aW9uKSAtPlxuICAgICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgIHNldExvY2F0aW9uIGxvY2F0aW9uLCBjb3VudHJpZXNcbiAgICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXSwgcHltQ2hpbGRcblxuKSBqUXVlcnlcbiJdfQ==
