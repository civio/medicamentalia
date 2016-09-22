module Jekyll

  module ArticleUtils
    def slugify(str)
      return str.downcase.strip.gsub(' ', '-').gsub(/[^a-z0-9-]/, '').gsub(/[-]+/, '-')
    end
  end
  
  module AnchorLinksGenerator
    
    include ArticleUtils

    def add_anchor_links(text)
      text.gsub(/\<h2\>(.+?)\<\/h2\>/){ s = $1; '<a id="'+slugify(s)+'" class="page-anchor"></a><h2>'+s+'</h2>' }
    end
  end

  class ArticleMenuTag < Liquid::Tag

    include ArticleUtils

    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      # context.environments.first['page'] return page object
      get_menu(context.environments.first['page']['content']);
    end

    private

    def get_menu(content)
      menu = '';
      # Matches h2 tags in content
      content.gsub(/\<h2\>(.+?)\<\/h2\>/){ 
        s = $1;
        menu = menu + '<li><a href="#'+slugify(s)+'" title="'+s+'">'+s+'</a></li>';
      }
      return menu
    end
  end
end

# Use add_anchor_links filter as {{ content | add_anchor_links }}
Liquid::Template.register_filter(Jekyll::AnchorLinksGenerator)

# Use article_menu tag as {% article_menu page %}
Liquid::Template.register_tag('article_menu', Jekyll::ArticleMenuTag)