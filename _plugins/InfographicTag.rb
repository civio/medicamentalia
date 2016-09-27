module Jekyll

  class InfographicTag < Liquid::Tag

    def initialize(tag_name, markup, tokens)
      super

      # Get tag attributes
      @attributes = {}

      markup.scan(Liquid::TagAttributes) do |key, value|
        @attributes[key] = value
      end
    end

    def render(context)
      # Get infographic data from 'data/infographics.yml'
      data = context.registers[:site].data['infographics'][@attributes['id']][@attributes['lang']]

      if data
        # Load infographic include
        partial = Liquid::Template.parse( File.read('_includes/infographic.html') )
        # Render infographic inlude with its data
        partial.render( data )
      end
    end
  end
end

# Use infographic tag as {% infographic id:counterfeits, lang:en %}
Liquid::Template.register_tag('infographic', Jekyll::InfographicTag)
