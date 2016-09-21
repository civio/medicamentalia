module Jekyll
  module AnchorLinksGenerator
    def add_anchor_links(text)
      text.gsub(/\<h2\>(.+?)\<\/h2\>/){ s = $1; "<a id=\"#{s.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/, '')}\" class=\"page-anchor\"></a><h2>#{s}</h2>" }
    end
  end
end

Liquid::Template.register_filter(Jekyll::AnchorLinksGenerator)
