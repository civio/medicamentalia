module Jekyll

  class GalleryTag < Liquid::Tag

    def initialize(tag_name, markup, tokens)
      super
    end

    def render(context)
      # Get gallery data from 'page.gallery'
      gallery_data = context.environments.first['page']['gallery']

      if gallery_data

        data = {
          'id' => context.environments.first['page']['ref'],
          'gallery' => gallery_data
        }

        # Load gallery include
        partial = Liquid::Template.parse( File.read('_includes/gallery.html') )
        # Render gallery inlude with its data
        partial.render( data )
      end
    end
  end
end

# Use gallery tag as {% gallery %}
Liquid::Template.register_tag('gallery', Jekyll::GalleryTag)
