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
      this.$app.find('.contraceptives-app-label-small').hide();
      if (this.dhs_countries[this.country_code]) {
        this.$app.find('#contraceptives-app-data-year').html(this.dhs_countries[this.country_code].year);
        this.$app.find('.contraceptives-app-label-small').show();
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
        countryUse = this.data.use.filter((function(_this) {
          return function(d) {
            return d.code === _this.country_code;
          };
        })(this));
        if (countryUse && countryUse[0]) {
          this.$app.find('#contraceptives-app-data-year').html(countryUse[0]['survey year']);
          this.$app.find('.contraceptives-app-label-small').show();
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
          if (countryUse.length === 0) {
            this.$app.find('#contraceptives-app-data-year').html(countryUnmetneeds[0]['survey'] ? countryUnmetneeds[0]['survey_year'] : 2016);
            this.$app.find('.contraceptives-app-label-small').show();
          }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRyYWNlcHRpdmVzLWFwcC5jb2ZmZWUiLCJtYWluLWNvbnRyYWNlcHRpdmVzLXN0YXRpYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFNLE1BQU0sQ0FBQztnQ0FFWCxXQUFBLEdBQ0U7TUFBQSx5QkFBQSxFQUEyQixXQUEzQjtNQUNBLHlCQUFBLEVBQTJCLEtBRDNCO01BRUEseUJBQUEsRUFBMkIsV0FGM0I7TUFHQSx5QkFBQSxFQUEyQixRQUgzQjs7O2dDQUtGLGFBQUEsR0FDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FERjtNQUdBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FKRjtNQU1BLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLFNBRFI7T0FWRjtNQVlBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FiRjtNQWVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0FoQkY7TUFrQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsTUFEUjtPQW5CRjtNQXFCQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsVUFBUjtRQUNBLE1BQUEsRUFBUSxNQURSO09BdEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxVQUFSO1FBQ0EsTUFBQSxFQUFRLE1BRFI7T0F6QkY7TUEyQkEsS0FBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFVBQVI7UUFDQSxNQUFBLEVBQVEsU0FEUjtPQTVCRjtNQThCQSxLQUFBLEVBQ0U7UUFBQSxN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LEVBS2tCLE9BQUEsR0FBUSwwQkFMMUIsQ0FNRSxDQUFDLEtBTkgsQ0FNUyxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLGVBQWxCLEVBQW1DLFlBQW5DLEVBQWlELFNBQWpELEVBQTRELEdBQTVEO1FBQ0wsV0FBQSxDQUFZLFFBQVosRUFBc0IsU0FBdEI7UUFDQSxJQUFHLENBQUEsQ0FBRSxxQkFBRixDQUF3QixDQUFDLE1BQTVCO2lCQUNNLElBQUEsaUJBQUEsQ0FBa0IsSUFBbEIsRUFBd0IsUUFBeEIsRUFBa0MsZUFBbEMsRUFBbUQsWUFBbkQsRUFBaUUsV0FBakUsRUFBOEUsWUFBOUUsRUFBNEYsYUFBYyxDQUFBLElBQUEsQ0FBMUcsRUFBaUgsaUJBQWtCLENBQUEsSUFBQSxDQUFuSSxFQUEwSSxhQUFjLENBQUEsSUFBQSxDQUF4SixFQUErSixpQkFBa0IsQ0FBQSxJQUFBLENBQWpMLEVBQXdMLFFBQXhMLEVBRE47O01BRkssQ0FOVDtJQUZxQyxDQUF2QztFQXhPRCxDQUFELENBQUEsQ0FxUEUsTUFyUEY7QUFBQSIsImZpbGUiOiJjb250cmFjZXB0aXZlcy1zdGF0aWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyB3aW5kb3cuQ29udHJhY2VwdGl2ZXNBcHBcblxuICBmaWx0ZXJfa2V5czogXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0wJzogJ3Jlc2lkZW5jZSdcbiAgICAnY29udHJhY2VwdGl2ZXMtZmlsdGVyLTEnOiAnYWdlJ1xuICAgICdjb250cmFjZXB0aXZlcy1maWx0ZXItMic6ICdlZHVjYXRpb24nXG4gICAgJ2NvbnRyYWNlcHRpdmVzLWZpbHRlci0zJzogJ3dlYWx0aCdcblxuICBkaHNfY291bnRyaWVzOlxuICAgICdBRkcnOlxuICAgICAgJ25hbWUnOiAnQUZJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE3J1xuICAgICdBTEInOlxuICAgICAgJ25hbWUnOiAnQUxJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdBUk0nOlxuICAgICAgJ25hbWUnOiAnQU1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdBR08nOlxuICAgICAgJ25hbWUnOiAnQU9JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdBWkUnOlxuICAgICAgJ25hbWUnOiAnQVpJUjUyRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCR0QnOlxuICAgICAgJ25hbWUnOiAnQkRJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdCRU4nOlxuICAgICAgJ25hbWUnOiAnQkpJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdCT0wnOlxuICAgICAgJ25hbWUnOiAnQk9JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdCREknOlxuICAgICAgJ25hbWUnOiAnQlVJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEwJ1xuICAgICdDT0QnOlxuICAgICAgJ25hbWUnOiAnQ0RJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdDT0cnOlxuICAgICAgJ25hbWUnOiAnQ0dJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDSVYnOlxuICAgICAgJ25hbWUnOiAnQ0lJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdDTVInOlxuICAgICAgJ25hbWUnOiAnQ01JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdDT0wnOlxuICAgICAgJ25hbWUnOiAnQ09JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdET00nOlxuICAgICAgJ25hbWUnOiAnRFJJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdFR1knOlxuICAgICAgJ25hbWUnOiAnRUdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdFVEgnOlxuICAgICAgJ25hbWUnOiAnRVRJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdHSEEnOlxuICAgICAgJ25hbWUnOiAnR0hJUjcyRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdHTUInOlxuICAgICAgJ25hbWUnOiAnR01JUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdHSU4nOlxuICAgICAgJ25hbWUnOiAnR05JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdHVE0nOlxuICAgICAgJ25hbWUnOiAnR1VJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdHVVknOlxuICAgICAgJ25hbWUnOiAnR1lJUjVJRFQnXG4gICAgICAneWVhcic6ICcyMDA5J1xuICAgICdITkQnOlxuICAgICAgJ25hbWUnOiAnSE5JUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExLTEyJ1xuICAgICdIVEknOlxuICAgICAgJ25hbWUnOiAnSFRJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdJTkQnOlxuICAgICAgJ25hbWUnOiAnSUFJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdJRE4nOlxuICAgICAgJ25hbWUnOiAnSURJUjYzRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdKT1InOlxuICAgICAgJ25hbWUnOiAnSk9JUjZDRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdLRU4nOlxuICAgICAgJ25hbWUnOiAnS0VJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdLSE0nOlxuICAgICAgJ25hbWUnOiAnS0hJUjczRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdMQlInOlxuICAgICAgJ25hbWUnOiAnTEJJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdMU08nOlxuICAgICAgJ25hbWUnOiAnTFNJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0J1xuICAgICdNQVInOlxuICAgICAgJ25hbWUnOiAnTUFJUjQzRFQnXG4gICAgICAneWVhcic6ICcyMDAzLTA0J1xuICAgICdNREcnOlxuICAgICAgJ25hbWUnOiAnTURJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA4LTA5J1xuICAgICdNTEknOlxuICAgICAgJ25hbWUnOiAnTUxJUjUzRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdNTVInOlxuICAgICAgJ25hbWUnOiAnTU1JUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdNV0knOlxuICAgICAgJ25hbWUnOiAnTVdJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdNT1onOlxuICAgICAgJ25hbWUnOiAnTVpJUjYyRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdOR0EnOlxuICAgICAgJ25hbWUnOiAnTkdJUjZBRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdORVInOlxuICAgICAgJ25hbWUnOiAnTklJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdOQU0nOlxuICAgICAgJ25hbWUnOiAnTk1JUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdOUEwnOlxuICAgICAgJ25hbWUnOiAnTlBJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE2J1xuICAgICdQRVInOlxuICAgICAgJ25hbWUnOiAnUEVJUjZJRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdQSEwnOlxuICAgICAgJ25hbWUnOiAnUEhJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdQQUsnOlxuICAgICAgJ25hbWUnOiAnUEtJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdSV0EnOlxuICAgICAgJ25hbWUnOiAnUldJUjcwRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuICAgICdTTEUnOlxuICAgICAgJ25hbWUnOiAnU0xJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzJ1xuICAgICdTRU4nOlxuICAgICAgJ25hbWUnOiAnU05JUjZERFQnXG4gICAgICAneWVhcic6ICcyMDEyLTEzJ1xuICAgICdTVFAnOlxuICAgICAgJ25hbWUnOiAnU1RJUjUwRFQnXG4gICAgICAneWVhcic6ICcyMDA4J1xuICAgICdTV1onOlxuICAgICAgJ25hbWUnOiAnU1pJUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA2J1xuICAgICdUQ0QnOlxuICAgICAgJ25hbWUnOiAnVERJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE0LTE1J1xuICAgICdUR08nOlxuICAgICAgJ25hbWUnOiAnVEdJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEzLTE0J1xuICAgICdUSksnOlxuICAgICAgJ25hbWUnOiAnVEpJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDEyJ1xuICAgICdUTFMnOlxuICAgICAgJ25hbWUnOiAnVExJUjYxRFQnXG4gICAgICAneWVhcic6ICcyMDA5LTEwJ1xuICAgICdUWkEnOlxuICAgICAgJ25hbWUnOiAnVFpJUjdIRFQnXG4gICAgICAneWVhcic6ICcyMDE1LTE2J1xuICAgICdVR0EnOlxuICAgICAgJ25hbWUnOiAnVUdJUjYwRFQnXG4gICAgICAneWVhcic6ICcyMDExJ1xuICAgICdaTUInOlxuICAgICAgJ25hbWUnOiAnWk1JUjUxRFQnXG4gICAgICAneWVhcic6ICcyMDA3J1xuICAgICdaV0UnOlxuICAgICAgJ25hbWUnOiAnWldJUjcxRFQnXG4gICAgICAneWVhcic6ICcyMDE1J1xuXG4gIHNlbnRlbmNlczogXG4gICAgJ2VzJzpcbiAgICAgICdBTEInOiAnTGEgbWFyY2hhIGF0csOhcyBlcyBlbCBwcmltZXIgbcOpdG9kbyBhbnRpY29uY2VwdGl2byBkZSBBbGJhbmlhLiBBZGVtw6FzLCBzZSB0cmF0YSBkZWwgc2VndW5kbyBwYcOtcyBkb25kZSBleGlzdGUgbWF5b3Igb3Bvc2ljacOzbiBkZSBsYSBwcm9waWEgbXVqZXIsIGxhIHBhcmVqYSBvIGxhIHJlbGlnacOzbiBhIHRvbWFyIGFudGljb25jZXB0aXZvcy4nXG4gICAgICAnQVJHJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jbGFyaW4uY29tL3NvY2llZGFkL2NhbXBhbmEtbGV5LWFib3J0by1jb21lbnpvLTIwMDUtcHJveWVjdG8tcHJlc2VudG8tdmVjZXNfMF9CSnZkaTBuUHouaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPlVuYXMgY2luY28gbWlsIG11amVyZXMgbWFyY2hhcm9uIGVuIGZlYnJlcm8gZGUgMjAxOCBmcmVudGUgYWwgQ29uZ3Jlc28gYXJnZW50aW5vIHBhcmEgcGVkaXIgbGEgbGVnYWxpemFjacOzbiBkZWwgYWJvcnRvLjwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiIHRhcmdldD1cIl9ibGFua1wiPk11Y2hvcyBhdXN0cmFsaWFub3MgZXN0w6FuIHZvbHZpZW5kbyBhIHV0aWxpemFyIG3DqXRvZG9zIHRyYWRpY2lvbmFsZXMgZGUgYW50aWNvbmNlcGNpw7NuLCBzZWfDum4gdW4gZXN0dWRpbyBkZSBNb25hc2ggVW5pdmVyc2l0eS48L2E+J1xuICAgICAgJ0JFTCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+QsOpbGdpY2EgZG9uw7MgMTAgbWlsbG9uZXMgZGUgZXVyb3MgcGFyYSBsYSBjYW1wYcOxYSA8aT5TaGUgRGVjaWRlczwvaT4sIGxhbnphZGEgcG9yIGVsIEdvYmllcm5vIGhvbGFuZMOpcyBwYXJhIGNvbnRyYXJyZXN0YXIgbGEgcmV0aXJhZGEgZGUgZm9uZG9zIHBhcmEgcGxhbmlmaWNhY2nDs24gZmFtaWxpYXIgZGUgVHJ1bXAuPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RmFybWFjaWFzIGRlIEJvbGl2aWEgaW1wbGVtZW50YXJvbiBjw7NkaWdvcyBzZWNyZXRvcyBwYXJhIHBlZGlyIHByZXNlcnZhdGl2b3MgeSBldml0YXIgZWwgZXN0aWdtYSBkZSBjb21wcmFyIGVzdG9zIGFudGljb25jZXB0aXZvcy48L2E+J1xuICAgICAgJ0NITic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubnl0aW1lcy5jb20vMjAxNy8wMS8wNy93b3JsZC9hc2lhL2FmdGVyLW9uZS1jaGlsZC1wb2xpY3ktb3V0cmFnZS1hdC1jaGluYXMtb2ZmZXItdG8tcmVtb3ZlLWl1ZHMuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPkVsIEdvYmllcm5vIGNoaW5vIG9mcmVjZSBsYSByZXRpcmFkYSBncmF0dWl0YSBkZSBESVVzIGRlc3B1w6lzIGRlIGxhIHBvbMOtdGljYSBkZWwgaGlqbyDDum5pY28uPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgU2FsdmFkb3IgZXMgZWwgw7puaWNvIHBhw61zIGRlbCBtdW5kbyBkb25kZSBhYm9ydGFyIGVzdMOhIHBlbmFkbyBjb24gY8OhcmNlbC48L2E+J1xuICAgICAgJ0ZJTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5oZWxzaW5raXRpbWVzLmZpL2ZpbmxhbmQvZmlubGFuZC9uZXdzL2RvbWVzdGljLzE1MjcxLWhlbHNpbmtpLXRvLW9mZmVyLXllYXItcy13b3J0aC1vZi1jb250cmFjZXB0aXZlLXBpbGxzLXRvLXVuZGVyLTI1LXllYXItb2xkcy5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgYXl1bnRhbWllbnRvIGRlIEhlbHNpbmtpIHByb3BvcmNpb25hIGFudGljb25jZXB0aXZvcyBkZSBtYW5lcmEgZ3JhdHVpdGEgYSBsb3MgasOzdmVuZXMgbWVub3JlcyBkZSAyNSBhw7Fvcy48L2E+J1xuICAgICAgJ0ZSQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY29ubmV4aW9uZnJhbmNlLmNvbS9GcmVuY2gtbmV3cy9GcmVuY2gtd29tZW4tb3B0LWZvci1hbHRlcm5hdGl2ZXMtYXMtUGlsbC11c2UtZHJvcHNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCB1c28gZGUgbGFzIHBhc3RpbGxhcyBhbnRpY29uY2VwdGl2YXMgc2UgaGEgcmVkdWNpZG8gZW4gRnJhbmNpYSBkZXNkZSAyMDEwLjwvYT4nXG4gICAgICAnR01CJzogJ0VuIEdhbWJpYSwgbXVjaGFzIG11amVyZXMgdXRpbGl6YW4gdW4gbcOpdG9kbyB0cmFkaWNpb25hbCBxdWUgY29uc2lzdGUgZW4gYXRhciBhIGxhIGNpbnR1cmEgdW5hIGN1ZXJkYSwgdW5hIHJhbWEsIG8gdW4gcGFwZWxpdG8gY29uIG8gc2luIGZyYXNlcyBkZWwgQ29yw6FuLidcbiAgICAgICdERVUnOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuZHcuY29tL2VuL2ZyZWUtcHJlc2NyaWJlZC1jb250cmFjZXB0aW9uLWZvci1sb3ctZWFybmVycy9hLTM4MTYxNTc3XCIgdGFyZ2V0PVwiX2JsYW5rXCI+VW4gcHJveWVjdG8gYWxlbcOhbiBmYWNpbGl0YSBhbnRpY29uY2VwdGl2b3MgZGUgZm9ybWEgZ3JhdHVpdGEgYSBtdWplcmVzIGRlIG3DoXMgZGUgMjAgYcOxb3MgY29uIGluZ3Jlc29zIGJham9zLjwvYT4nXG4gICAgICAnR1RNJzogJzxhIGhyZWY9XCJodHRwOi8vYnVmZi5seS8ydGFZd2NvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TGEgcmVsaWdpw7NuIGluZmx1eWUgZW4gbGEgZWR1Y2FjacOzbiBzZXh1YWwgZGUgbG9zIGrDs3ZlbmVzIGd1YXRlbWFsdGVjb3MuPC9hPidcbiAgICAgICdJUkwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RW4gSXJsYW5kYSBlcyBpbGVnYWwgYWJvcnRhciBhIG5vIHNlciBxdWUgaGF5YSB1biByaWVzZ28gcmVhbCBkZSBzYWx1ZCBwYXJhIGxhIG1hZHJlLjwvYT4nXG4gICAgICAnSVNSJzogJ0VuIGxvcyBzZWN0b3JlcyBqdWTDrW9zIG3DoXMgb3J0b2RveG9zLCBzb2xvIHB1ZWRlbiB1c2Fyc2UgbG9zIGFudGljb25jZXB0aXZvcyBzaSBlbCByYWJpbm8gZGEgc3UgcGVybWlzbyBhIGxhIG11amVyLidcbiAgICAgICdKUE4nOiAnSmFww7NuLCBhdW5xdWUgc2UgZW5jdWVudHJhIGVuIGVsIGdydXBvIGRlIHBhw61zZXMgY29uIHJlbnRhIGFsdGEsIGVzIGxhIGV4Y2VwY2nDs246IGxhcyBuZWNlc2lkYWRlcyBubyBjdWJpZXJ0YXMgY29uIGFudGljb25jZXB0aXZvcyBlc3TDoSBhbCBuaXZlbCBkZSBwYcOtc2VzIGNvbiByZW50YXMgYmFqYXMuJ1xuICAgICAgJ1BSSyc6ICdFbCA5NSUgZGUgbXVqZXJlcyBxdWUgdXRpbGl6YW4gYW50aWNvbmNlcHRpdm9zIGVuIENvcmVhIGRlbCBOb3J0ZSBoYW4gZWxlZ2lkbyBlbCBESVUuIFNlIHRyYXRhIGRlbCBtYXlvciBwb3JjZW50YWplIGRlIHVzbyBhIG5pdmVsIG11bmRpYWwuJ1xuICAgICAgJ05MRCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgZ29iaWVybm8gaG9sYW5kw6lzIGxhbnphIGVsIHByb3llY3RvIDxpPlNoZSBEZWNpZGVzPC9pPiBwYXJhIGNvbnRyYXJyZXN0YXIgbGEgcmV0aXJhZGEgZGUgZm9uZG9zIHBhcmEgcGxhbmlmaWNhY2nDs24gZmFtaWxpYXIgZGUgVHJ1bXAuPC9hPidcbiAgICAgICdQRVInOiAnPGEgaHJlZj1cImh0dHBzOi8vaW50ZXJhY3RpdmUucXVpcHUtcHJvamVjdC5jb20vIy9lcy9xdWlwdS9pbnRyb1wiIHRhcmdldD1cIl9ibGFua1wiPkVuIGxhIMOpcG9jYSBkZSBsb3MgOTAsIGR1cmFudGUgZWwgZ29iaWVybm8gZGUgRnVqaW1vcmksIG3DoXMgZGUgMjUwLjAwMCBtdWplcmVzIGZ1ZXJvbiBlc3RlcmlsaXphZGFzIHNpbiBzdSBjb25zZW50aW1pZW50by48L2E+J1xuICAgICAgJ1BITCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L2p1bC8xMC9ob3ctYml0dGVyLWhlcmJzLWFuZC1ib3RjaGVkLWFib3J0aW9ucy1raWxsLXRocmVlLXdvbWVuLWEtZGF5LWluLXRoZS1waGlsaXBwaW5lc1wiIHRhcmdldD1cIl9ibGFua1wiPiBFbiB1biBwYcOtcyBkb25kZSBlbCBhYm9ydG8gZGVsIGVzdMOhIHByb2hpYmlkbywgdHJlcyBtdWplcmVzIG11ZXJlbiBhbCBkw61hIHBvciBjb21wbGljYWNpb25lcyBkZXJpdmFkYXMgZGUgaW50ZXJ2ZW5jaW9uZXMgaWxlZ2FsZXMuPC9hPidcbiAgICAgICdQT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmFtbmVzdHkub3JnL2VuL2xhdGVzdC9uZXdzLzIwMTcvMDYvcG9sYW5kLWVtZXJnZW5jeS1jb250cmFjZXB0aW9uLXJlc3RyaWN0aW9ucy1jYXRhc3Ryb3BoaWMtZm9yLXdvbWVuLWFuZC1naXJscy9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5FbCBHb2JpZXJubyBwb2xhY28gZGEgdW4gcGFzbyBhdHLDoXMgeSBzZSBjb252aWVydGUgZW4gZWwgw7puaWNvIHBhw61zIGRlIGxhIFVuacOzbiBFdXJvcGVhIGRvbmRlIGxhIHBhc3RpbGxhIGRlbCBkw61hIGRlc3B1w6lzIGVzdMOhIHN1amV0YSBhIHByZXNjcmlwY2nDs24uPC9hPidcbiAgICAgICdTU0QnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQvMjAxNy9tYXkvMjUvZXZlcnkteWVhci1pLWdpdmUtYmlydGgtd2FyLWRyaXZpbmctY29udHJhY2VwdGlvbi1jcmlzaXMtc3VkYW4tbnViYS1tb3VudGFpbnNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5MYSBndWVycmEgZW4gU3Vkw6FuIGVzdMOhIGNyZWFuZG8gdW5hIGNyaXNpcyBlbiBlbCBhY2Nlc28gYSBhbnRpY29uY2VwdGl2b3MuPC9hPidcbiAgICAgICdFU1AnOiAnPGEgaHJlZj1cImh0dHA6Ly9jYWRlbmFzZXIuY29tL2VtaXNvcmEvMjAxNy8wOS8xOS9yYWRpb19tYWRyaWQvMTUwNTg0MjkzMl8xMzEwMzEuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPk1hZHJpZCBlcyBsYSDDum5pY2EgY29tdW5pZGFkIHF1ZSBubyBmaW5hbmNpYSBhbnRpY29uY2VwdGl2b3MgY29uIHN1cyBmb25kb3MuPC9hPidcbiAgICAgICdUVVInOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYmJjLmNvbS9uZXdzL3dvcmxkLWV1cm9wZS0zNjQxMzA5N1wiIHRhcmdldD1cIl9ibGFua1wiPkVyZG9nYW4gZGVjbGFyYSBxdWUgbGEgcGxhbmlmaWNhY2nDs24gZmFtaWxpYXIgbm8gZXMgcGFyYSBsb3MgbXVzdWxtYW5lcy48L2E+J1xuICAgICAgJ1VHQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubmV3dmlzaW9uLmNvLnVnL25ld192aXNpb24vbmV3cy8xNDU4ODgyL3VnYW5kYS1mYWNpbmctMTUwLW1pbGxpb24tY29uZG9tLXNob3J0ZmFsbFwiIHRhcmdldD1cIl9ibGFua1wiPkVuIDIwMTcsIGVsIE1pbmlzdGVyaW8gZGUgU2FsdWQgZGUgVWdhbmRhIGRlY2xhcmFiYSB1biBkZXNhYmFzdGVjaW1pZW50byBkZSAxNTAgbWlsbG9uZXMgZGUgcHJlc2VydmF0aXZvcyBtYXNjdWxpbm9zLjwvYT4nXG4gICAgICAnVVNBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE4LzAxLzE4L3VzL2hlYWx0aC1jYXJlLW9mZmljZS1hYm9ydGlvbi1jb250cmFjZXB0aW9uLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5UcnVtcCBkYSBhIGxvcyBtw6lkaWNvcyBsaWJlcnRhZCBwYXJhIG5lZ2Fyc2UgYSByZWFsaXphciBwcm9jZWRpbWllbnRvcyBlbiBjb250cmEgZGUgc3VzIGNyZWVuY2lhcyByZWxpZ2lvc2FzLCBjb21vIGVsIGFib3J0by48L2E+J1xuICAgICAgJ1ZFTic6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5iYmMuY29tL211bmRvL25vdGljaWFzLWFtZXJpY2EtbGF0aW5hLTQyNjM1NDEyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TGEgZXNjYXNleiB5IGVsIHByZWNpbyBlbGV2YWRvIGRlIGxvcyBhbnRpY29uY2VwdGl2b3MgZW4gVmVuZXp1ZWxhIGluZmx1eWUgZW4gZWwgYXVtZW50byBkZSBlbWJhcmF6b3Mgbm8gZGVzZWFkb3MuPC9hPidcbiAgICAgICdaTUInOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmlkZW8ub3JnL3Byb2plY3QvZGl2YS1jZW50cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+VW4gcHJveWVjdG8gZW4gWmFtYmlhICB1bmUgbGEgbWFuaWN1cmEgeSBsb3MgYW50aWNvbmNlcHRpdm9zLjwvYT4nXG4gICAgJ2VuJzpcbiAgICAgICdBTEInOiAnV2l0aGRyYXduIGlzIHRoZSBtb3N0IHVzZWQgY29udHJhY2VwdGl2ZSBtZXRob2QgYnkgQWxiYW5pYW4gd29tZW4uIEZ1cnRoZXJtb3JlLCBpdCBpcyB0aGUgc2Vjb25kIGNvdW50cnkgd2hlcmUgdGhlIG9wcG9zaXRpb24gb2YgdGhlIHJlc3BvbmRlbnQsIHRoZSBwYXJ0bmVyIG9yIHRoZSByZWxpZ2lvbiB0byB1c2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIGlzIHRoZSBtYWluIGJhcnJpZXIgZm9yIHVzaW5nIHRoZW0gd2hlbiB0aGV5IGFyZSBuZWVkZWQuJ1xuICAgICAgJ0FSRyc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuY2xhcmluLmNvbS9zb2NpZWRhZC9jYW1wYW5hLWxleS1hYm9ydG8tY29tZW56by0yMDA1LXByb3llY3RvLXByZXNlbnRvLXZlY2VzXzBfQkp2ZGkwblB6Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BcHByb3hpbWF0ZWx5IGZpdmUgdGhvdXNhbmQgd29tZW4gbWFyY2hlZCBpbiBGZWJydWFyeSAyMDE4IGluIGZyb250IG9mIHRoZSBBcmdlbnRpbmUgQ29uZ3Jlc3MgdG8gZGVtYW5kIHRoZSBsZWdhbGl6YXRpb24gb2YgYWJvcnRpb24uIDwvYT4nXG4gICAgICAnQVVTJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmFiYy5uZXQuYXUvbmV3cy9oZWFsdGgvMjAxNy0wNy0yMi9uYXR1cmFsLW1ldGhvZHMtb2YtY29udHJhY2VwdGlvbi1vbi10aGUtcmlzZS1pbi1hdXN0cmFsaWEvODY4MzM0NlwiIHRhcmdldD1cIl9ibGFua1wiPk5hdHVyYWwgbWV0aG9kcyBvZiBjb250cmFjZXB0aW9uIG9uIHRoZSByaXNlIGluIEF1c3RyYWxpYSwgYWNjb3JkaW5nIHRvIGFuIGludmVzdGlnYXRpb24gb2YgTW9uYXNoIFVuaXZlcnNpdHkuIDwvYT4nXG4gICAgICAnQkVMJzogJzxhIGhyZWY9XCJodHRwOi8vd3d3LmR1dGNobmV3cy5ubC9uZXdzL2FyY2hpdmVzLzIwMTcvMDMvc2hlLWRlY2lkZXMtZm91bmRhdGlvbi1icmluZ3MtaW4tZTE4MW0tZm9yLWZhbWlseS1wbGFubmluZy1jYW1wYWlnbi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5CZWxnaXVtIGhhdmUgZG9uYXRlZCAxMCBtaWxsaW9uIGV1cm9zIHRvIHRoZSA8aT5TaGUgRGVjaWRlczwvaT4gcHJveWVjdCwgbGF1bmNoZWQgYnkgdGhlIER1dGNoIGdvdmVybm1lbnQgdG8gYm9vc3QgY29udHJhY2VwdGlvbiBpbiBkZXZlbG9waW5nIGNvdW50cmllcy4gPC9hPidcbiAgICAgICdCT0wnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LmVmZS5jb20vZWZlL2FtZXJpY2Evc29jaWVkYWQvbGEtdmVyZ8O8ZW56YS15LWVsLWVzdGlnbWEtZGUtcGVkaXItcHJlc2VydmF0aXZvcy1lbi1ib2xpdmlhLy8yMDAwMDAxMy0zMjY1NjUyXCIgdGFyZ2V0PVwiX2JsYW5rXCI+Qm9saXZpYVxcJ3MgcGhhcm1hY2llcyBoYXZlIGRldmVsb3BlZCBhIHNlY3JldCBjb2RlIHRvIGFzayBmb3IgY29uZG9tcyBhbmQgdGhlcmVmb3JlLCB0byBhdm9pZCBzdGlnbWEgYWJvdXQgYnV5aW5nIHRoZW0uPC9hPidcbiAgICAgICdDSE4nOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3Lm55dGltZXMuY29tLzIwMTcvMDEvMDcvd29ybGQvYXNpYS9hZnRlci1vbmUtY2hpbGQtcG9saWN5LW91dHJhZ2UtYXQtY2hpbmFzLW9mZmVyLXRvLXJlbW92ZS1pdWRzLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BZnRlciBvbmUgY2hpbGQgcG9saWNpeSwgb3V0cmFnZSBhdCBDaGluYVxcJ3Mgb2ZmZXIgdG8gcmVtb3ZlIElVRHMuPC9hPidcbiAgICAgICdTTFYnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS9nbG9iYWwtZGV2ZWxvcG1lbnQtcHJvZmVzc2lvbmFscy1uZXR3b3JrL2dhbGxlcnkvMjAxNy9tYXkvMjYvcmVwcm9kdWN0aXZlLXJpZ2h0cy16aWthLXdvbWVuLWVsLXNhbHZhZG9yLWluLXBpY3R1cmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RWwgU2FsdmFkb3IgaXMgb25lIG9mIHNpeCBjb3VudHJpZXMgd2hlcmUgYWJvcnRpb24gaXMgYmFubmVkIHVuZGVyIGFueSBjaXJjdW1zdGFuY2VzLCBhbmQgd29tZW4gd2hvIHVuZGVyZ28gaXQgY291bGQgZmFjZSBwcmlzb24gPC9hPidcbiAgICAgICdGSU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuaGVsc2lua2l0aW1lcy5maS9maW5sYW5kL2ZpbmxhbmQvbmV3cy9kb21lc3RpYy8xNTI3MS1oZWxzaW5raS10by1vZmZlci15ZWFyLXMtd29ydGgtb2YtY29udHJhY2VwdGl2ZS1waWxscy10by11bmRlci0yNS15ZWFyLW9sZHMuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPkhlbHNpbmtpIHRvIG9mZmVyIHllYXLigJlzIHdvcnRoIG9mIGNvbnRyYWNlcHRpdmUgcGlsbHMgdG8gdW5kZXIgMjUteWVhci1vbGRzLjwvYT4nXG4gICAgICAnRlJBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5jb25uZXhpb25mcmFuY2UuY29tL0ZyZW5jaC1uZXdzL0ZyZW5jaC13b21lbi1vcHQtZm9yLWFsdGVybmF0aXZlcy1hcy1QaWxsLXVzZS1kcm9wc1wiIHRhcmdldD1cIl9ibGFua1wiPkZyZW5jaCB3b21lbiBvcHQgZm9yIGFsdGVybmF0aXZlcyBhcyBQaWxsIHVzZSBkcm9wcy48L2E+J1xuICAgICAgJ0dNQic6ICdJbiBUaGUgR2FtYmlhLCBtYW55IHdvbWVuIHVzZSBhIHRyYWRpdGlvbmFsIG1ldGhvZCB0aGF0IGludm9sdmVzIHR5aW5nIGEgcm9wZSwgYSBicmFuY2ggb3IgYSBwaWVjZSBvZiBwYXBlciBhcm91bmQgdGhlIHdhaXN0IHdpdGggLW9yIHdpdGhvdXQtIHBocmFzZXMgZnJvbSB0aGUgS29yYW4gaW4gaXQuJ1xuICAgICAgJ0RFVSc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdy5jb20vZW4vZnJlZS1wcmVzY3JpYmVkLWNvbnRyYWNlcHRpb24tZm9yLWxvdy1lYXJuZXJzL2EtMzgxNjE1NzdcIiB0YXJnZXQ9XCJfYmxhbmtcIj5BIHRyaWFsIHNjaGVtZSBpbiBHZXJtYW55IGlzIGhlbHBpbmcgd29tZW4gb24gbG93IGluY29tZXMgdG8gYXZvaWQgc2FjcmlmaWNpbmcgdGhlaXIgY29udHJhY2VwdGlvbi48L2E+J1xuICAgICAgJ0dUTSc6ICc8YSBocmVmPVwiaHR0cDovL2J1ZmYubHkvMnRhWXdjb1wiIHRhcmdldD1cIl9ibGFua1wiPlJlbGlnaW9uIGhhcyBhIG1ham9yIGluZmx1ZW5jZSBpbiBzZXh1YWwgZWR1Y2F0aW9uIG9mIEd1YXRlbWFsYSB5b3VuZyBwZW9wbGUuPC9hPidcbiAgICAgICdJUkwnOiAnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnRoZWd1YXJkaWFuLmNvbS93b3JsZC8yMDE4L2phbi8yOS9pcmVsYW5kLXRvLWdyZWVubGlnaHQtcmVmZXJlbmR1bS1vbi1hYm9ydGlvbi1sYXctcmVmb3JtXCIgdGFyZ2V0PVwiX2JsYW5rXCI+SXJpc2ggcmVmZXJlbmR1bSBvbiBhYm9ydGlvbiByZWZvcm0gdG8gYmUgaGVsZCBieSBlbmQgb2YgTWF5IDIwMTg8L2E+J1xuICAgICAgJ0lTUic6ICdJbiB1bHRyYSBvcnRob2RveCBqdWRhaXNtLCBjb250cmFjZXB0aXZlIHVzZSBpcyBvbmx5IHBlcm1pdHRlZCBpZiB0aGUgcmFiYmkgZ2l2ZXMgcHJldmlvdXMgcGVybWlzc2lvbiB0byB0aGUgd29tYW4uJ1xuICAgICAgJ0pQTic6ICdKYXBhbiwgZXZlbiBpZiBpdCBpcyBwYXJ0IG9mIHRoZSBncm91cCBvZiBjb3VudHJpZXMgd2l0aCBoaWdoIGluY29tZSwgaGFzIHVubWV0IG5lZWRzIGZvciBjb250cmFjZXB0aW9uIGF0IHRoZSBsZXZlbCBvZiBjb3VudHJpZXMgd2l0aCBsb3cgaW5jb21lLidcbiAgICAgICdQUksnOiAnOTUlIG9mIHdvbWVuIHdobyB1c2UgY29udHJhY2VwdGl2ZSBtZXRob2RzIGluIE5vcnRoIEtvcmVhIGhhdmUgY2hvc2VuIHRvIHVzZSBJVURzLiBJdCBpcyB0aGUgaGlnaGVzdCBwZXJjZW50YWdlIG9mIHVzZSBvZiB0aGlzIG1ldGhvZCB3b3JsZHdpZGUuJ1xuICAgICAgJ05MRCc6ICc8YSBocmVmPVwiaHR0cDovL3d3dy5kdXRjaG5ld3MubmwvbmV3cy9hcmNoaXZlcy8yMDE3LzAzL3NoZS1kZWNpZGVzLWZvdW5kYXRpb24tYnJpbmdzLWluLWUxODFtLWZvci1mYW1pbHktcGxhbm5pbmctY2FtcGFpZ24vXCIgdGFyZ2V0PVwiX2JsYW5rXCI+RHV0Y2ggaW5pdGlhdGl2ZSBicmluZ3MgaW4g4oKsMTgxbSBmb3IgZmFtaWx5IHBsYW5uaW5nIGNhbXBhaWduLjwvYT4nXG4gICAgICAnUEVSJzogJzxhIGhyZWY9XCJodHRwczovL2ludGVyYWN0aXZlLnF1aXB1LXByb2plY3QuY29tLyMvZXMvcXVpcHUvaW50cm9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5JbiB0aGUgMTk5MHMsIEFsYmVydG8gRnVqaW1vcmksIGZvcm1lciBwcmVzaWRlbnQgb2YgUGVydSwgbGF1bmNoZWQgYSBuZXcgZmFtaWx5IHBsYW5uaW5nIHByb2dyYW1tZSB0aGF0IHJlc3VsdGVkIGluIHRoZSBzdGVyaWxpc2F0aW9uIG9mIDI3MiwwMjggd29tZW4gYW5kIDIyLDAwNCBtZW4gaW4gb25seSA0IHllYXJzLjwvYT4nXG4gICAgICAnUEhMJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy50aGVndWFyZGlhbi5jb20vZ2xvYmFsLWRldmVsb3BtZW50LzIwMTcvanVsLzEwL2hvdy1iaXR0ZXItaGVyYnMtYW5kLWJvdGNoZWQtYWJvcnRpb25zLWtpbGwtdGhyZWUtd29tZW4tYS1kYXktaW4tdGhlLXBoaWxpcHBpbmVzXCIgdGFyZ2V0PVwiX2JsYW5rXCI+IEhvdyBiaXR0ZXIgaGVyYnMgYW5kIGJvdGNoZWQgYWJvcnRpb25zIGtpbGwgdGhyZWUgd29tZW4gYSBkYXkgaW4gdGhlIFBoaWxpcHBpbmVzLjwvYT4nXG4gICAgICAnUE9MJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5hbW5lc3R5Lm9yZy9lbi9sYXRlc3QvbmV3cy8yMDE3LzA2L3BvbGFuZC1lbWVyZ2VuY3ktY29udHJhY2VwdGlvbi1yZXN0cmljdGlvbnMtY2F0YXN0cm9waGljLWZvci13b21lbi1hbmQtZ2lybHMvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+UG9saXNoIEdvdmVybm1lbnQgdGFrZXMgYSBzdGVwIGJhY2sgaW4gdGhlIGFjY2VzcyB0byB0aGUgXCJtb3JuaW5nLWFmdGVyXCIgcGlsbCBhbmQgaXQgYmVjb21lcyB0aGUgb25seSBFdXJvcGVhbiBjb3VudHJ5IHdoZXJlIHdvbWVuIG5lZWQgYSBwcmVzY3JpcHRpb24gZm9yIHRoZSB1c2Ugb2YgdGhpcyBjb250cmFjZXB0aXZlIG1ldGhvZC48L2E+J1xuICAgICAgJ1NTRCc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cudGhlZ3VhcmRpYW4uY29tL2dsb2JhbC1kZXZlbG9wbWVudC8yMDE3L21heS8yNS9ldmVyeS15ZWFyLWktZ2l2ZS1iaXJ0aC13YXItZHJpdmluZy1jb250cmFjZXB0aW9uLWNyaXNpcy1zdWRhbi1udWJhLW1vdW50YWluc1wiIHRhcmdldD1cIl9ibGFua1wiPlxcJ0V2ZXJ5IHllYXIsIEkgZ2l2ZSBiaXJ0aFxcJzogd2h5IHdhciBpcyBkcml2aW5nIGEgY29udHJhY2VwdGlvbiBjcmlzaXMgaW4gU3VkYW4uPC9hPidcbiAgICAgICdFU1AnOiAnPGEgaHJlZj1cImh0dHA6Ly9jYWRlbmFzZXIuY29tL2VtaXNvcmEvMjAxNy8wOS8xOS9yYWRpb19tYWRyaWQvMTUwNTg0MjkzMl8xMzEwMzEuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPk1hZHJpZCBpcyB0aGUgb25seSByZWdpb25hbCBnb3Zlcm5tZW50IHRoYXQgZG9lcyBub3QgZmluYW5jZSBjb250cmFjZXB0aXZlIG1ldGhvZHMgd2l0aCBpdHMgZnVuZHMuPC9hPidcbiAgICAgICdUVVInOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYmJjLmNvbS9uZXdzL3dvcmxkLWV1cm9wZS0zNjQxMzA5N1wiIHRhcmdldD1cIl9ibGFua1wiPlR1cmtleVxcJ3MgRXJkb2dhbiB3YXJucyBNdXNsaW1zIGFnYWluc3QgYmlydGggY29udHJvbC48L2E+J1xuICAgICAgJ1VHQSc6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cubmV3dmlzaW9uLmNvLnVnL25ld192aXNpb24vbmV3cy8xNDU4ODgyL3VnYW5kYS1mYWNpbmctMTUwLW1pbGxpb24tY29uZG9tLXNob3J0ZmFsbFwiIHRhcmdldD1cIl9ibGFua1wiPkluIDIwMTcsIFVnYW5kYSBmYWNlZCBhIDE1MCBtaWxsaW9ucyBtYWxlIGNvbmRvbXMgc2hvcnRmYWxsLjwvYT4nXG4gICAgICAnVVNBJzogJzxhIGhyZWY9XCJodHRwczovL3d3dy5ueXRpbWVzLmNvbS8yMDE4LzAxLzE4L3VzL2hlYWx0aC1jYXJlLW9mZmljZS1hYm9ydGlvbi1jb250cmFjZXB0aW9uLmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj5UcnVtcCBnaXZlcyBoZWFsdGggd29ya2VycyBuZXcgcmVsaWdpb3VzIGxpYmVydHkgcHJvdGVjdGlvbnMuPC9hPidcbiAgICAgICdWRU4nOiAnPGEgaHJlZj1cImh0dHA6Ly93d3cuYmJjLmNvbS9tdW5kby9ub3RpY2lhcy1hbWVyaWNhLWxhdGluYS00MjYzNTQxMlwiIHRhcmdldD1cIl9ibGFua1wiPlRoZSBzaG9ydGFnZSBhbmQgaGlnaCBwcmljZSBvZiBjb250cmFjZXB0aXZlcyBpbiBWZW5lenVlbGEgaW5mbHVlbmNlcyB0aGUgaW5jcmVhc2UgaW4gdW53YW50ZWQgcHJlZ25hbmNpZXM8L2E+J1xuICAgICAgJ1pNQic6ICc8YSBocmVmPVwiaHR0cHM6Ly93d3cuaWRlby5vcmcvcHJvamVjdC9kaXZhLWNlbnRyZXNcIiB0YXJnZXQ9XCJfYmxhbmtcIj5JbiBaYW1iaWEsIGEgcmFkaWNhbCBuZXcgYXBwcm9hY2ggdG8gY29udHJhY2VwdGlvbiBpcyBnaXZpbmcgYWRvbGVzY2VudCBnaXJscyB0aGUgaW5mb3JtYXRpb24gYW5kIHNlcnZpY2VzIG9mIGNvbnRyYWNlcHRpb24gd2hpbGUgZG9pbmcgdGhlIG1hbmljdXJlLjwvYT4nXG5cblxuICBjb25zdHJ1Y3RvcjogKGxhbmcsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgdXNlcl9jb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXMsIG1ldGhvZHNfZGhzX25hbWVzLCByZWFzb25zX25hbWVzLCByZWFzb25zX2Roc19uYW1lcywgcHltKSAtPlxuXG4gICAgQHNlbnRlbmNlcyA9IEBzZW50ZW5jZXNbbGFuZ11cblxuICAgIEBkYXRhID0gXG4gICAgICB1c2U6ICAgICAgICBkYXRhX3VzZVxuICAgICAgdW5tZXRuZWVkczogZGF0YV91bm1ldG5lZWRzXG4gICAgICByZWFzb25zOiAgICBkYXRhX3JlYXNvbnNcblxuICAgIEBtZXRob2RzS2V5cyAgICAgID0gbWV0aG9kc19rZXlzXG4gICAgQG1ldGhvZHNOYW1lcyAgICAgPSBtZXRob2RzX25hbWVzXG4gICAgQG1ldGhvZHNESFNOYW1lcyAgPSBtZXRob2RzX2Roc19uYW1lc1xuICAgIEByZWFzb25zTmFtZXMgICAgID0gcmVhc29uc19uYW1lc1xuICAgIEByZWFzb25zREhTTmFtZXMgID0gcmVhc29uc19kaHNfbmFtZXNcblxuICAgIEBweW0gPSBweW1cblxuICAgIEAkYXBwID0gJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpXG5cbiAgICBAJGFwcC5maW5kKCcuc2VsZWN0LWNvdW50cnknKVxuICAgICAgLnNlbGVjdDIoKVxuICAgICAgLmNoYW5nZSBAb25TZWxlY3RDb3VudHJ5XG4gICAgICAudmFsIHVzZXJfY291bnRyeS5jb2RlXG4gICAgICAudHJpZ2dlciAnY2hhbmdlJ1xuXG4gICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzIC5idG4nKS5jbGljayBAb25TZWxlY3RGaWx0ZXJcblxuICAgIEAkYXBwLmNzcygnb3BhY2l0eScsMSlcblxuXG4gIG9uU2VsZWN0Q291bnRyeTogKGUpID0+XG4gICAgQGNvdW50cnlfY29kZSA9ICQoZS50YXJnZXQpLnZhbCgpXG5cbiAgICB1c2UgICAgICAgICAgID0gbnVsbFxuICAgIG1ldGhvZCAgICAgICAgPSBudWxsXG4gICAgbWV0aG9kX3ZhbHVlICA9IG51bGxcbiAgICB1bm1ldG5lZWRzICAgID0gbnVsbFxuICAgIHJlYXNvbiAgICAgICAgPSBudWxsXG4gICAgcmVhc29uX3ZhbHVlICA9IG51bGxcblxuICAgICMgaGlkZSBmaWx0ZXJzICYgY2xlYXIgYWN0aXZlIGJ0bnNcbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5oaWRlKCkuZmluZCgnLmJ0bicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICMgaGlkZSBmaWx0ZXJzIHJlc3VsdHNcbiAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgIyBjbGVhciBkYXRhIHllYXJcbiAgICBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWxhYmVsLXNtYWxsJykuaGlkZSgpXG5cbiAgICBpZiBAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXVxuICAgICAgIyBzZXQgZGF0YSB5ZWFyXG4gICAgICBAJGFwcC5maW5kKCcjY29udHJhY2VwdGl2ZXMtYXBwLWRhdGEteWVhcicpLmh0bWwgQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ueWVhclxuICAgICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1sYWJlbC1zbWFsbCcpLnNob3coKVxuICAgICAgIyBsb2FkIGNvdW50cnkgZGhzIGRhdGFcbiAgICAgIGQzLmNzdiAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpKycvZGF0YS9jb250cmFjZXB0aXZlcy1yZWFzb25zLycrQGRoc19jb3VudHJpZXNbQGNvdW50cnlfY29kZV0ubmFtZSsnX2FsbC5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGQgPSBkYXRhWzBdXG4gICAgICAgICMgc2V0dXAgZGF0YVxuICAgICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIDEwMCooZC5uLWQubm90X3VzaW5nX2NvbnRyYWNlcHRpb24pL2QubiwgQG1ldGhvZHNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9tZXRob2RdLCAxMDAqZC5tb3N0X3BvcHVsYXJfbWV0aG9kX24vZC5uLCAxMDAqZC53aXRoX3VubWV0X25lZWRzL2QubiwgQHJlYXNvbnNESFNOYW1lc1tkLm1vc3RfcG9wdWxhcl9yZWFzb25dLCAxMDAqZC5tb3N0X3BvcHVsYXJfcmVhc29uX24vZC5uX3JlYXNvbnMsIEBzZW50ZW5jZXNbQGNvdW50cnlfY29kZV1cbiAgICAgICAgIyBzaG93IGZpbHRlcnNcbiAgICAgICAgQCRhcHAuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1maWx0ZXJzJykuc2hvdygpXG4gICAgICAgICMgdXBkYXRlIGlmcmFtZSBoZWlnaHRcbiAgICAgICAgaWYgQHB5bVxuICAgICAgICAgIEBweW0uc2VuZEhlaWdodCgpXG4gICAgZWxzZVxuICAgICAgIyBVc2VcbiAgICAgIGNvdW50cnlVc2UgPSBAZGF0YS51c2UuZmlsdGVyIChkKSA9PiBkLmNvZGUgPT0gQGNvdW50cnlfY29kZVxuICAgICAgI2NvbnNvbGUubG9nIGNvdW50cnlVc2VcbiAgICAgIGlmIGNvdW50cnlVc2UgYW5kIGNvdW50cnlVc2VbMF1cbiAgICAgICAgIyBzZXQgZGF0YSB5ZWFyXG4gICAgICAgIEAkYXBwLmZpbmQoJyNjb250cmFjZXB0aXZlcy1hcHAtZGF0YS15ZWFyJykuaHRtbCBjb3VudHJ5VXNlWzBdWydzdXJ2ZXkgeWVhciddXG4gICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbGFiZWwtc21hbGwnKS5zaG93KClcbiAgICAgICAgaWYgY291bnRyeVVzZVswXVsnQW55IG1vZGVybiBtZXRob2QnXSAhPSAnMCdcbiAgICAgICAgICB1c2UgICAgICAgICAgID0gcGFyc2VGbG9hdChjb3VudHJ5VXNlWzBdWydBbnkgbW9kZXJuIG1ldGhvZCddKSArIHBhcnNlRmxvYXQoY291bnRyeVVzZVswXVsnQW55IHRyYWRpdGlvbmFsIG1ldGhvZCddKVxuICAgICAgICBjb3VudHJ5X21ldGhvZHMgPSBAbWV0aG9kc0tleXMubWFwIChrZXksIGkpID0+IHsnbmFtZSc6IEBtZXRob2RzTmFtZXNbaV0sICd2YWx1ZSc6ICtjb3VudHJ5VXNlWzBdW2tleV19XG4gICAgICAgIGNvdW50cnlfbWV0aG9kcyA9IGNvdW50cnlfbWV0aG9kcy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICBtZXRob2QgICAgICAgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0ubmFtZVxuICAgICAgICBtZXRob2RfdmFsdWUgICAgPSBjb3VudHJ5X21ldGhvZHNbMF0udmFsdWVcbiAgICAgICMgVW5tZXRuZWVkc1xuICAgICAgY291bnRyeVVubWV0bmVlZHMgPSBAZGF0YS51bm1ldG5lZWRzLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlVbm1ldG5lZWRzIGFuZCBjb3VudHJ5VW5tZXRuZWVkc1swXVxuICAgICAgICAjIHVzZSBzdXJ2ZXkgZGF0YSBpZiBhdmFpbGFibGUsIHVzZSBlc3RpbWF0ZWQgaWYgbm90XG4gICAgICAgIHVubWV0bmVlZHMgPSBpZiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gdGhlbiBjb3VudHJ5VW5tZXRuZWVkc1swXVsnc3VydmV5J10gZWxzZSBjb3VudHJ5VW5tZXRuZWVkc1swXVsnZXN0aW1hdGVkJ11cbiAgICAgICAgIyBzZXQgZGF0YSB5ZWFyIGlmIG5vIGNvdW50cnlVc2UgZGF0YVxuICAgICAgICBpZiBjb3VudHJ5VXNlLmxlbmd0aCA9PSAwXG4gICAgICAgICAgIyBzdXJ2ZXlfeWVhciBmb3Igc3VydmV5IGRhdGEgJiAyMDE2IGluIG90aGVyIGNhc2VzXG4gICAgICAgICAgQCRhcHAuZmluZCgnI2NvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXllYXInKS5odG1sIGlmIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXknXSB0aGVuIGNvdW50cnlVbm1ldG5lZWRzWzBdWydzdXJ2ZXlfeWVhciddIGVsc2UgMjAxNlxuICAgICAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbGFiZWwtc21hbGwnKS5zaG93KClcbiAgICAgICMgUmVhc29uc1xuICAgICAgY291bnRyeVJlYXNvbnMgPSBAZGF0YS5yZWFzb25zLmZpbHRlciAoZCkgPT4gZC5jb2RlID09IEBjb3VudHJ5X2NvZGVcbiAgICAgIGlmIGNvdW50cnlSZWFzb25zIGFuZCBjb3VudHJ5UmVhc29uc1swXVxuICAgICAgICByZWFzb25zICAgICAgPSBPYmplY3Qua2V5cyhAcmVhc29uc05hbWVzKS5tYXAgKHJlYXNvbikgPT4geyduYW1lJzogQHJlYXNvbnNOYW1lc1tyZWFzb25dLCAndmFsdWUnOiArY291bnRyeVJlYXNvbnNbMF1bcmVhc29uXX1cbiAgICAgICAgcmVhc29ucyAgICAgID0gcmVhc29ucy5zb3J0IChhLGIpIC0+IGIudmFsdWUtYS52YWx1ZVxuICAgICAgICByZWFzb24gICAgICAgPSByZWFzb25zWzBdLm5hbWVcbiAgICAgICAgcmVhc29uX3ZhbHVlID0gcmVhc29uc1swXS52YWx1ZVxuICAgICAgIyBzZXR1cCBkYXRhXG4gICAgICBAc2V0QXBwSXRlbURhdGEgQCRhcHAsIHVzZSwgbWV0aG9kLCBtZXRob2RfdmFsdWUsIHVubWV0bmVlZHMsIHJlYXNvbiwgcmVhc29uX3ZhbHVlLCBAc2VudGVuY2VzW0Bjb3VudHJ5X2NvZGVdXG4gICAgICAjIHVwZGF0ZSBpZnJhbWUgaGVpZ2h0XG4gICAgICBpZiBAcHltXG4gICAgICAgIEBweW0uc2VuZEhlaWdodCgpXG5cblxuICBvblNlbGVjdEZpbHRlcjogKGUpID0+XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgQGZpbHRlciAhPSAkKGUudGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSB7c2Nyb2xsVG9wOiBAJGFwcC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLWZpbHRlcnMnKS5vZmZzZXQoKS50b3AtMTV9LCA0MDBcbiAgICAgIEAkYXBwLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZmlsdGVycyAuYnRuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkdGFyZ2V0ID0gJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICBAZmlsdGVyID0gJHRhcmdldC5hdHRyKCdocmVmJykuc3Vic3RyaW5nKDEpXG4gICAgICAkKCcuY29udHJhY2VwdGl2ZXMtZmlsdGVyJykuaGlkZSgpXG4gICAgICBAZmlsdGVyRWwgPSAkKCcjJytAZmlsdGVyKS5zaG93KClcbiAgICAgICMgbG9hZCBjc3YgZmlsZVxuICAgICAgZDMuY3N2ICQoJ2JvZHknKS5kYXRhKCdiYXNldXJsJykrJy9kYXRhL2NvbnRyYWNlcHRpdmVzLXJlYXNvbnMvJytAZGhzX2NvdW50cmllc1tAY291bnRyeV9jb2RlXS5uYW1lKydfJytAZmlsdGVyX2tleXNbQGZpbHRlcl0rJy5jc3YnLCAoZXJyb3IsIGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGFcbiAgICAgICAgICBkYXRhLmZvckVhY2ggKGQpID0+XG4gICAgICAgICAgICBAc2V0QXBwSXRlbURhdGEgQGZpbHRlckVsLmZpbmQoJyMnK0BmaWx0ZXIrJy0nK2QuaWQpLCAxMDAqKGQubi1kLm5vdF91c2luZ19jb250cmFjZXB0aW9uKS9kLm4sIEBtZXRob2RzREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfbWV0aG9kXSwgMTAwKmQubW9zdF9wb3B1bGFyX21ldGhvZF9uL2QubiwgMTAwKmQud2l0aF91bm1ldF9uZWVkcy9kLm4sIEByZWFzb25zREhTTmFtZXNbZC5tb3N0X3BvcHVsYXJfcmVhc29uXSwgMTAwKmQubW9zdF9wb3B1bGFyX3JlYXNvbl9uL2Qubl9yZWFzb25zXG4gICAgICAgICAgIyBVcGRhdGUgaWZyYW1lIGhlaWdodFxuICAgICAgICAgIGlmIEBweW1cbiAgICAgICAgICAgIEBweW0uc2VuZEhlaWdodCgpXG5cblxuICBzZXRBcHBJdGVtRGF0YTogKCRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWUsIHNlbnRlbmNlKSAtPlxuXG4gICAgI2NvbnNvbGUubG9nICdzZXRBcHBJdGVtRGF0YScsICRlbCwgdXNlLCBtZXRob2QsIG1ldGhvZF92YWx1ZSwgdW5tZXRuZWVkcywgcmVhc29uLCByZWFzb25fdmFsdWVcblxuICAgIGlmIHVzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS11c2UnKS5odG1sIE1hdGgucm91bmQoK3VzZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC11c2UnKS5oaWRlKClcblxuICAgIGlmIG1ldGhvZFxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1tYWluLW1ldGhvZCcpLmh0bWwgbWV0aG9kXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLW1haW4tbWV0aG9kLXZhbHVlJykuaHRtbCBNYXRoLnJvdW5kKCttZXRob2RfdmFsdWUpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuc2hvdygpXG4gICAgZWxzZVxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtbWV0aG9kJykuaGlkZSgpXG5cbiAgICBpZiB1bm1ldG5lZWRzXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1kYXRhLXVubWV0bmVlZHMnKS5odG1sIE1hdGgucm91bmQoK3VubWV0bmVlZHMpKyclJ1xuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtdW5tZXRuZWVkcycpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXVubWV0bmVlZHMnKS5oaWRlKClcblxuICAgIGlmIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24nKS5odG1sIHJlYXNvblxuICAgICAgJGVsLmZpbmQoJy5jb250cmFjZXB0aXZlcy1hcHAtZGF0YS1yZWFzb24tdmFsdWUnKS5odG1sIE1hdGgucm91bmQoK3JlYXNvbl92YWx1ZSkrJyUnXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5zaG93KClcbiAgICBlbHNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1yZWFzb24nKS5oaWRlKClcblxuICAgIGlmIHNlbnRlbmNlXG4gICAgICAkZWwuZmluZCgnLmNvbnRyYWNlcHRpdmVzLWFwcC1zZW50ZW5jZScpLmh0bWwoc2VudGVuY2UpLnNob3coKVxuICAgIGVsc2VcbiAgICAgICRlbC5maW5kKCcuY29udHJhY2VwdGl2ZXMtYXBwLXNlbnRlbmNlJykuaGlkZSgpXG5cbiIsIiMgTWFpbiBzY3JpcHQgZm9yIGNvbnRyYWNlcHRpdmVzIGFydGljbGVzXG5cbigoJCkgLT5cbiAgXG4gIHVzZXJDb3VudHJ5ID0ge31cblxuICAjIEdldCBjdXJyZW50IGFydGljbGUgbGFuZyAmIGJhc2UgdXJsXG4gIGxhbmcgICAgPSAkKCdib2R5JykuZGF0YSgnbGFuZycpXG4gIGJhc2V1cmwgPSAkKCdib2R5JykuZGF0YSgnYmFzZXVybCcpXG5cbiAgI2NvbnNvbGUubG9nICdjb250cmFjZXB0aXZlcycsIGxhbmcsIGJhc2V1cmxcblxuICAjIHNldHVwIGZvcm1hdCBudW1iZXJzXG4gIGlmIGxhbmcgPT0gJ2VzJ1xuICAgIGQzLmZvcm1hdERlZmF1bHRMb2NhbGUge1xuICAgICAgXCJjdXJyZW5jeVwiOiBbXCIkXCIsXCJcIl1cbiAgICAgIFwiZGVjaW1hbFwiOiBcIixcIlxuICAgICAgXCJ0aG91c2FuZHNcIjogXCIuXCJcbiAgICAgIFwiZ3JvdXBpbmdcIjogWzNdXG4gICAgfVxuXG4gIG1ldGhvZHNfa2V5cyA9IFtcbiAgICBcIkZlbWFsZSBzdGVyaWxpemF0aW9uXCJcbiAgICBcIk1hbGUgc3RlcmlsaXphdGlvblwiXG4gICAgXCJJVURcIlxuICAgIFwiSW1wbGFudFwiXG4gICAgXCJJbmplY3RhYmxlXCJcbiAgICBcIlBpbGxcIlxuICAgIFwiTWFsZSBjb25kb21cIlxuICAgIFwiRmVtYWxlIGNvbmRvbVwiXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCJcbiAgXVxuXG4gIG1ldGhvZHNfbmFtZXMgPSBcbiAgICAnZXMnOiBbXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICBcImVzdGVyaWxpemFjacOzbiBtYXNjdWxpbmFcIlxuICAgICAgXCJESVVcIlxuICAgICAgXCJpbXBsYW50ZVwiXG4gICAgICBcImlueWVjdGFibGVcIlxuICAgICAgXCJww61sZG9yYVwiXG4gICAgICBcImNvbmTDs24gbWFzY3VsaW5vXCJcbiAgICAgIFwiY29uZMOzbiBmZW1lbmlub1wiXG4gICAgICBcIm3DqXRvZG9zIGRlIGJhcnJlcmEgdmFnaW5hbFwiXG4gICAgICBcIm3DqXRvZG8gZGUgbGEgYW1lbm9ycmVhIGRlIGxhIGxhY3RhbmNpYSAoTUVMQSlcIlxuICAgICAgXCJhbnRpY29uY2VwdGl2b3MgZGUgZW1lcmdlbmNpYVwiXG4gICAgICBcIm90cm9zIG3DqXRvZG9zIG1vZGVybm9zXCJcbiAgICAgIFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgXVxuICAgICdlbic6IFtcbiAgICAgIFwiZmVtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgXCJtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgXCJJVURcIlxuICAgICAgXCJpbXBsYW50XCJcbiAgICAgIFwiaW5qZWN0YWJsZVwiXG4gICAgICBcInBpbGxcIlxuICAgICAgXCJtYWxlIGNvbmRvbVwiXG4gICAgICBcImZlbWFsZSBjb25kb21cIlxuICAgICAgXCJ2YWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiXG4gICAgICBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgIFwiZW1lcmdlbmN5IGNvbnRyYWNlcHRpb25cIlxuICAgICAgXCJvdGhlciBtb2Rlcm4gbWV0aG9kc1wiXG4gICAgICBcInRyYWRpdGlvbmFsIG1ldGhvZHNcIlxuICAgIF1cblxuICBtZXRob2RzX2Roc19uYW1lcyA9IFxuICAgICdlcyc6IFxuICAgICAgJzEnOiBcInDDrWxkb3JhXCJcbiAgICAgICcyJzogXCJESVVcIlxuICAgICAgJzMnOiBcImlueWVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmTDs25cIlxuICAgICAgJzYnOiBcImVzdGVyaWxpemFjacOzbiBmZW1lbmluYVwiXG4gICAgICAnNyc6IFwiZXN0ZXJpbGl6YWNpw7NuIG1hc2N1bGluYVwiXG4gICAgICAnOCc6IFwiYWJzdGluZW5jaWEgcGVyacOzZGljYVwiXG4gICAgICAnOSc6IFwibWFyY2hhIGF0csOhc1wiXG4gICAgICAnMTAnOiBcIm90cm9zXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudGVcIlxuICAgICAgJzEzJzogXCJtw6l0b2RvIGRlIGxhIGFtZW5vcnJlYSBkZSBsYSBsYWN0YW5jaWEgKE1FTEEpXCJcbiAgICAgICcxNyc6IFwibcOpdG9kb3MgdHJhZGljaW9uYWxlc1wiXG4gICAgJ2VuJzpcbiAgICAgICcxJzogXCJwaWxsXCJcbiAgICAgICcyJzogXCJJVURcIlxuICAgICAgJzMnOiBcImluamVjdGFibGVcIlxuICAgICAgJzUnOiBcImNvbmRvbVwiXG4gICAgICAnNic6IFwiZmVtYWxlIHN0ZXJpbGlzYXRpb25cIlxuICAgICAgJzcnOiBcIm1hbGUgc3RlcmlsaXNhdGlvblwiXG4gICAgICAnOCc6IFwicGVyaW9kaWMgYWJzdGluZW5jZVwiXG4gICAgICAnOSc6IFwid2l0aGRyYXdhbFwiXG4gICAgICAnMTAnOiBcIm90aGVyXCJcbiAgICAgICcxMSc6IFwiaW1wbGFudFwiXG4gICAgICAnMTMnOiBcImxhY3RhdGlvbmFsIGFtZW5vcnJoZWEgbWV0aG9kIChMQU0pXCJcbiAgICAgICcxNyc6IFwidHJhZGl0aW9uYWwgbWV0aG9kc1wiXG5cblxuICAjIyNcbiAgbWV0aG9kc19pY29ucyA9IFxuICAgIFwiRmVtYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJNYWxlIHN0ZXJpbGl6YXRpb25cIjogJ3N0ZXJpbGl6YXRpb24nXG4gICAgXCJJVURcIjogJ2RpdSdcbiAgICBcIkltcGxhbnRcIjogbnVsbFxuICAgIFwiSW5qZWN0YWJsZVwiOiAnaW5qZWN0YWJsZSdcbiAgICBcIlBpbGxcIjogJ3BpbGwnXG4gICAgXCJNYWxlIGNvbmRvbVwiOiAnY29uZG9tJ1xuICAgIFwiRmVtYWxlIGNvbmRvbVwiOiBudWxsXG4gICAgXCJWYWdpbmFsIGJhcnJpZXIgbWV0aG9kc1wiOiBudWxsXG4gICAgXCJMYWN0YXRpb25hbCBhbWVub3JyaGVhIG1ldGhvZCAoTEFNKVwiOiBudWxsXG4gICAgXCJFbWVyZ2VuY3kgY29udHJhY2VwdGlvblwiOiBudWxsXG4gICAgXCJPdGhlciBtb2Rlcm4gbWV0aG9kc1wiOiBudWxsXG4gICAgXCJBbnkgdHJhZGl0aW9uYWwgbWV0aG9kXCI6ICd0cmFkaXRpb25hbCdcbiAgIyMjXG5cbiAgcmVhc29uc19uYW1lcyA9IFxuICAgICdlcyc6XG4gICAgICBcImFcIjogXCJubyBlc3TDoW4gY2FzYWRhc1wiXG4gICAgICBcImJcIjogXCJubyB0aWVuZW4gc2V4b1wiXG4gICAgICBcImNcIjogXCJ0aWVuZW4gc2V4byBpbmZyZWN1ZW50ZVwiXG4gICAgICBcImRcIjogXCJtZW5vcGF1c2lhIG8gZXN0ZXJpbGl6YWNpw7NuXCJcbiAgICAgIFwiZVwiOiBcInNvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXNcIlxuICAgICAgXCJmXCI6IFwiYW1lbm9ycmVhIHBvc3RwYXJ0b1wiXG4gICAgICBcImdcIjogXCJlc3TDoW4gZGFuZG8gZWwgcGVjaG9cIlxuICAgICAgXCJoXCI6IFwiZmF0YWxpc3RhXCJcbiAgICAgIFwiaVwiOiBcImxhIG11amVyIHNlIG9wb25lXCJcbiAgICAgIFwialwiOiBcImVsIG1hcmlkbyBvIGxhIHBhcmVqYSBzZSBvcG9uZVwiXG4gICAgICBcImtcIjogXCJvdHJvcyBzZSBvcG9uZW5cIiAgICAgICAgXG4gICAgICBcImxcIjogXCJwcm9oaWJpY2nDs24gcmVsaWdpb3NhXCIgIFxuICAgICAgXCJtXCI6IFwibm8gY29ub2NlIGxvcyBtw6l0b2Rvc1wiXG4gICAgICBcIm5cIjogXCJubyBjb25vY2UgbmluZ3VuYSBmdWVudGUgZG9uZGUgYWRxdWlyaXJsb3NcIlxuICAgICAgXCJvXCI6IFwicHJlb2N1cGFjaW9uZXMgZGUgc2FsdWRcIiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgXCJwXCI6IFwibWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcy9wcmVvY3VwYWNpb25lcyBkZSBzYWx1ZFwiIFxuICAgICAgXCJxXCI6IFwiZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvc1wiXG4gICAgICBcInJcIjogXCJjdWVzdGFuIGRlbWFzaWFkb1wiXG4gICAgICBcInNcIjogXCJpbmNvbnZlbmllbnRlcyBwYXJhIHN1IHVzb1wiXG4gICAgICBcInRcIjogXCJpbnRlcmZpZXJlIGNvbiBsb3MgcHJvY2Vzb3MgZGVsIGN1ZXJwb1wiXG4gICAgICBcInVcIjogXCJlbCBtw6l0b2RvIGVsZWdpZG8gbm8gZXN0w6EgZGlzcG9uaWJsZVwiXG4gICAgICBcInZcIjogXCJubyBoYXkgbcOpdG9kb3MgZGlzcG9uaWJsZXNcIlxuICAgICAgXCJ3XCI6IFwiKG5vIGVzdMOhbmRhcilcIlxuICAgICAgXCJ4XCI6IFwib3Ryb3NcIlxuICAgICAgXCJ6XCI6IFwibm8gbG8gc8OpXCJcbiAgICAnZW4nOlxuICAgICAgXCJhXCI6IFwibm90IG1hcnJpZWRcIlxuICAgICAgXCJiXCI6IFwibm90IGhhdmluZyBzZXhcIlxuICAgICAgXCJjXCI6IFwiaW5mcmVxdWVudCBzZXhcIlxuICAgICAgXCJkXCI6IFwibWVub3BhdXNhbC9oeXN0ZXJlY3RvbXlcIlxuICAgICAgXCJlXCI6IFwic3ViZmVjdW5kL2luZmVjdW5kXCJcbiAgICAgIFwiZlwiOiBcInBvc3RwYXJ0dW0gYW1lbm9ycmhlaWNcIlxuICAgICAgXCJnXCI6IFwiYnJlYXN0ZmVlZGluZ1wiXG4gICAgICBcImhcIjogXCJmYXRhbGlzdGljXCJcbiAgICAgIFwiaVwiOiBcInJlc3BvbmRlbnQgb3Bwb3NlZFwiXG4gICAgICBcImpcIjogXCJodXNiYW5kL3BhcnRuZXIgb3Bwb3NlZFwiXG4gICAgICBcImtcIjogXCJvdGhlcnMgb3Bwb3NlZFwiXG4gICAgICBcImxcIjogXCJyZWxpZ2lvdXMgcHJvaGliaXRpb25cIlxuICAgICAgXCJtXCI6IFwia25vd3Mgbm8gbWV0aG9kXCJcbiAgICAgIFwiblwiOiBcImtub3dzIG5vIHNvdXJjZVwiXG4gICAgICBcIm9cIjogXCJoZWFsdGggY29uY2VybnNcIlxuICAgICAgXCJwXCI6IFwiZmVhciBvZiBzaWRlIGVmZmVjdHMvaGVhbHRoIGNvbmNlcm5zXCJcbiAgICAgIFwicVwiOiBcImxhY2sgb2YgYWNjZXNzL3RvbyBmYXJcIlxuICAgICAgXCJyXCI6IFwiY29zdHMgdG9vIG11Y2hcIlxuICAgICAgXCJzXCI6IFwiaW5jb252ZW5pZW50IHRvIHVzZVwiXG4gICAgICBcInRcIjogXCJpbnRlcmZlcmVzIHdpdGggYm9kecKSJ3MgcHJvY2Vzc2VzXCJcbiAgICAgIFwidVwiOiBcInByZWZlcnJlZCBtZXRob2Qgbm90IGF2YWlsYWJsZVwiXG4gICAgICBcInZcIjogXCJubyBtZXRob2QgYXZhaWxhYmxlXCJcbiAgICAgIFwid1wiOiBcIihubyBlc3TDoW5kYXIpXCJcbiAgICAgIFwieFwiOiBcIm90aGVyXCJcbiAgICAgIFwielwiOiBcImRvbid0IGtub3dcIlxuXG4gIHJlYXNvbnNfZGhzX25hbWVzID0gXG4gICAgJ2VzJzogXG4gICAgICAndjNhMDhhJzogJ25vIGVzdMOhbiBjYXNhZGFzJ1xuICAgICAgJ3YzYTA4Yic6ICdubyB0aWVuZW4gc2V4bydcbiAgICAgICd2M2EwOGMnOiAndGllbmVuIHNleG8gaW5mcmVjdWVudGUnXG4gICAgICAndjNhMDhkJzogJ21lbm9wYXVzaWEgbyBlc3RlcmlsaXphY2nDs24nXG4gICAgICAndjNhMDhlJzogJ3NvbiBzdWJmZWN1bmRhcyBvIGluZmVjdW5kYXMnXG4gICAgICAndjNhMDhmJzogJ2FtZW5vcnJlYSBwb3N0cGFydG8nXG4gICAgICAndjNhMDhnJzogJ2VzdMOhbiBkYW5kbyBlbCBwZWNobydcbiAgICAgICd2M2EwOGgnOiAnZmF0YWxpc3RhJ1xuICAgICAgJ3YzYTA4aSc6ICdsYSBtdWplciBzZSBvcG9uZSdcbiAgICAgICd2M2EwOGonOiAnZWwgbWFyaWRvIG8gbGEgcGFyZWphIHNlIG9wb25lJ1xuICAgICAgJ3YzYTA4ayc6ICdvdHJvcyBzZSBvcG9uZW4nICAgICAgICBcbiAgICAgICd2M2EwOGwnOiAncHJvaGliaWNpw7NuIHJlbGlnaW9zYSdcbiAgICAgICd2M2EwOG0nOiAnbm8gY29ub2NlIGxvcyBtw6l0b2RvcydcbiAgICAgICd2M2EwOG4nOiAnbm8gY29ub2NlIG5pbmd1bmEgZnVlbnRlIGRvbmRlIGFkcXVpcmlybG9zJ1xuICAgICAgJ3YzYTA4byc6ICdwcmVvY3VwYWNpb25lcyBkZSBzYWx1ZCdcbiAgICAgICd2M2EwOHAnOiAnbWllZG8gYSBsb3MgZWZlY3RvcyBzZWN1bmRhcmlvcydcbiAgICAgICd2M2EwOHEnOiAnZmFsdGEgZGUgYWNjZXNvL211eSBsZWpvcydcbiAgICAgICd2M2EwOHInOiAnY3Vlc3RhbiBkZW1hc2lhZG8nXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudGVzIHBhcmEgc3UgdXNvJ1xuICAgICAgJ3YzYTA4dCc6IFwiaW50ZXJmaWVyZSBjb24gbG9zIHByb2Nlc29zIGRlbCBjdWVycG9cIlxuICAgICdlbic6IFxuICAgICAgJ3YzYTA4YSc6ICdub3QgbWFycmllZCdcbiAgICAgICd2M2EwOGInOiAnbm90IGhhdmluZyBzZXgnXG4gICAgICAndjNhMDhjJzogJ2luZnJlcXVlbnQgc2V4J1xuICAgICAgJ3YzYTA4ZCc6ICdtZW5vcGF1c2FsL2h5c3RlcmVjdG9teSdcbiAgICAgICd2M2EwOGUnOiAnc3ViZmVjdW5kL2luZmVjdW5kJ1xuICAgICAgJ3YzYTA4Zic6ICdwb3N0cGFydHVtIGFtZW5vcnJoZWljJ1xuICAgICAgJ3YzYTA4Zyc6ICdicmVhc3RmZWVkaW5nJ1xuICAgICAgJ3YzYTA4aCc6ICdmYXRhbGlzdGljJ1xuICAgICAgJ3YzYTA4aSc6ICdyZXNwb25kZW50IG9wcG9zZWQnXG4gICAgICAndjNhMDhqJzogJ2h1c2JhbmQvcGFydG5lciBvcHBvc2VkJ1xuICAgICAgJ3YzYTA4ayc6ICdvdGhlcnMgb3Bwb3NlZCdcbiAgICAgICd2M2EwOGwnOiAncmVsaWdpb3VzIHByb2hpYml0aW9uJ1xuICAgICAgJ3YzYTA4bSc6ICdrbm93cyBubyBtZXRob2QnXG4gICAgICAndjNhMDhuJzogJ2tub3dzIG5vIHNvdXJjZSdcbiAgICAgICd2M2EwOG8nOiAnaGVhbHRoIGNvbmNlcm5zJ1xuICAgICAgJ3YzYTA4cCc6ICdmZWFyIG9mIHNpZGUgZWZmZWN0cydcbiAgICAgICd2M2EwOHEnOiAnbGFjayBvZiBhY2Nlc3MvdG9vIGZhcidcbiAgICAgICd2M2EwOHInOiAnY29zdHMgdG9vIG11Y2gnXG4gICAgICAndjNhMDhzJzogJ2luY29udmVuaWVudCB0byB1c2UnXG4gICAgICAndjNhMDh0JzogXCJpbnRlcmZlcmVzIHdpdGggdGhlIGJvZHkncyBwcm9jZXNzZXNcIlxuXG5cbiAgc2V0TG9jYXRpb24gPSAobG9jYXRpb24sIGNvdW50cmllcykgLT5cbiAgICBpZiBsb2NhdGlvblxuICAgICAgdXNlcl9jb3VudHJ5ID0gY291bnRyaWVzLmZpbHRlciAoZCkgLT4gZC5jb2RlMiA9PSBsb2NhdGlvbi5jb3VudHJ5X2NvZGVcbiAgICAgIGlmIHVzZXJfY291bnRyeVswXVxuICAgICAgICB1c2VyQ291bnRyeS5jb2RlID0gdXNlcl9jb3VudHJ5WzBdLmNvZGVcbiAgICAgICAgdXNlckNvdW50cnkubmFtZSA9IHVzZXJfY291bnRyeVswXVsnbmFtZV8nK2xhbmddXG4gICAgZWxzZVxuICAgICAgbG9jYXRpb24gPSB7fVxuXG4gICAgdW5sZXNzIGxvY2F0aW9uLmNvZGVcbiAgICAgIHVzZXJDb3VudHJ5LmNvZGUgPSAnRVNQJ1xuICAgICAgdXNlckNvdW50cnkubmFtZSA9IGlmIGxhbmcgPT0gJ2VzJyB0aGVuICdFc3Bhw7FhJyBlbHNlICdTcGFpbidcblxuXG4gICMgU2V0dXBcbiAgIyAtLS0tLS0tLS0tLS0tLS1cblxuICBweW1DaGlsZCA9IG5ldyBweW0uQ2hpbGQoKVxuXG4gICMgTG9hZCBsb2NhdGlvblxuICBkMy5qc29uICdodHRwczovL2ZyZWVnZW9pcC5uZXQvanNvbi8nLCAoZXJyb3IsIGxvY2F0aW9uKSAtPlxuICAgICMgTG9hZCBjc3ZzICYgc2V0dXAgbWFwc1xuICAgIGQzLnF1ZXVlKClcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS9jb250cmFjZXB0aXZlcy11c2UtY291bnRyaWVzLmNzdidcbiAgICAgIC5kZWZlciBkMy5jc3YsICBiYXNldXJsKycvZGF0YS91bm1ldC1uZWVkcy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY29udHJhY2VwdGl2ZXMtcmVhc29ucy5jc3YnXG4gICAgICAuZGVmZXIgZDMuY3N2LCAgYmFzZXVybCsnL2RhdGEvY291bnRyaWVzLWduaS1wb3B1bGF0aW9uLTIwMTYuY3N2J1xuICAgICAgLmRlZmVyIGQzLmpzb24sIGJhc2V1cmwrJy9kYXRhL21hcC13b3JsZC0xMTAuanNvbidcbiAgICAgIC5hd2FpdCAoZXJyb3IsIGRhdGFfdXNlLCBkYXRhX3VubWV0bmVlZHMsIGRhdGFfcmVhc29ucywgY291bnRyaWVzLCBtYXApIC0+XG4gICAgICAgIHNldExvY2F0aW9uIGxvY2F0aW9uLCBjb3VudHJpZXNcbiAgICAgICAgaWYgJCgnI2NvbnRyYWNlcHRpdmVzLWFwcCcpLmxlbmd0aFxuICAgICAgICAgIG5ldyBDb250cmFjZXB0aXZlc0FwcCBsYW5nLCBkYXRhX3VzZSwgZGF0YV91bm1ldG5lZWRzLCBkYXRhX3JlYXNvbnMsIHVzZXJDb3VudHJ5LCBtZXRob2RzX2tleXMsIG1ldGhvZHNfbmFtZXNbbGFuZ10sIG1ldGhvZHNfZGhzX25hbWVzW2xhbmddLCByZWFzb25zX25hbWVzW2xhbmddLCByZWFzb25zX2Roc19uYW1lc1tsYW5nXSwgcHltQ2hpbGRcblxuKSBqUXVlcnlcbiJdfQ==
