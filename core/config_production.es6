export default {
    // PATHS
    xml_path: "ediphy/add_xml",
    xml_fake_path: "exercises/ua2_ue10_ejer7.xml",
    exercise_render_template_iframe_src: "./exercises/index.html",
    dist_index: "dist/index.html",
    dist_visor_bundle: "dist/visor-bundle.js",
    visor_bundle: "/assets/editor/visor-bundle.js",
    image_placeholder: "/assets/images/placeholder.svg",
    broken_link: "/assets/images/broken_link.png",
    scorm_ejs: "/assets/lib/scorm/scorm_nav.ejs",
    visor_ejs: "/assets/lib/visor/index",
    scorm_zip: "/assets/lib/scorm/scorm.zip",
    visor_zip: "/assets/lib/visor/dist.zip",
    export_url: "/ediphy_documents/",
    import_url: "/ediphy_documents/",
    search_vish_url: "http://vishub.org/apis/search/",
    upload_vish_url: "/documents.json",
    // OPTIONS
    external_providers: {
        enable_search: true,
        enable_external_upload: true,
        enable_catalog_modal: false,
    },
    publish_button: true,
    show_numbers_before_navitems: false,
    api_editor_url_change: true,
    open_button_enabled: false,
    sections_have_content: false,
    autosave_time: 30000,
    pluginList: [
        // 'BasicImage',
        'BasicText',
        // 'BasicPlayer',
        'DataTable',
        'EnrichedPlayer',
        'VirtualTour',
        'Webpage',
        'HotspotImages',
        // 'ContainerReact',
        // 'ContainerJS',
        'GraficaD3',
    ],
    availableLanguages: [
        'en',
        'es',
    ],
};
