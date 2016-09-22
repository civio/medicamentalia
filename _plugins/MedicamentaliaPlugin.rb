module Jekyll

  module MedicamentaliaUtils
    def slugify(str)
      return str.downcase.strip.gsub(' ', '-').gsub(/[^a-z0-9-]/, '').gsub(/[-]+/, '-')
    end
  end
  
  module AnchorLinksGenerator
    
    include MedicamentaliaUtils

    def add_anchor_links(text)
      text.gsub(/\<h2\>(.+?)\<\/h2\>/){ s = $1; '<a id="'+slugify(s)+'" class="page-anchor"></a><h2>'+s+'</h2>' }
    end
  end

  class PageMenuTag < Liquid::Tag

    include MedicamentaliaUtils

    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      get_menu(context)
    end

    private

    def get_menu(context)
      # Setup markdown parser with site.config
      parser = Jekyll::Converters::Markdown.new(context.registers[:site].config)
      # context.environments.first['page'] return page object
      content = parser.convert( context.environments.first['page']['content'] )
      menu = '';
      # Matches h2 tags in content
      content.gsub(/\<h2\>(.+?)\<\/h2\>/){ 
        s = $1
        menu = menu + '<li><a href="#'+slugify(s)+'" title="'+s+'">'+s+'</a></li>'
      }
      return menu
    end
  end
end

# Use add_anchor_links filter as {{ content | add_anchor_links }}
Liquid::Template.register_filter(Jekyll::AnchorLinksGenerator)

# Use article_menu tag as {% article_menu page %}
Liquid::Template.register_tag('page_menu', Jekyll::PageMenuTag)