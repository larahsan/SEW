import xml.etree.ElementTree as ET

arbol = ET.parse('xml/rutasEsquema.xml')
raiz = arbol.getroot()

def añadirPlacemark(doc, nombre,long,lat,alt, modoAltitud):
    pm = ET.SubElement(doc,'Placemark')
    ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
    punto = ET.SubElement(pm,'Point')
    ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
    ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

def añadirLineString(doc, nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
    ET.SubElement(doc,'name').text = '\n' + nombre + '\n'
    pm = ET.SubElement(doc,'Placemark')
    ls = ET.SubElement(pm, 'LineString')
    ET.SubElement(ls,'extrude').text = '\n' + extrude + '\n'
    ET.SubElement(ls,'tessellation').text = '\n' + tesela + '\n'
    ET.SubElement(ls,'coordinates').text = '\n' + listaCoordenadas + '\n'
    ET.SubElement(ls,'altitudeMode').text = '\n' + modoAltitud + '\n' 

    estilo = ET.SubElement(pm, 'Style')
    linea = ET.SubElement(estilo, 'LineStyle')
    ET.SubElement (linea, 'color').text = '\n' + color + '\n'
    ET.SubElement (linea, 'width').text = '\n' + ancho + '\n'

def escribir(nombreArchivoKML, raiz_kml):
    arbol_kml = ET.ElementTree(raiz_kml)
    arbol_kml.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def main():
    ns = {'u': 'http://www.uniovi.es'}
    rutas = raiz.findall('u:ruta', ns)
    
    for i, ruta in enumerate(rutas, start=1):
        raiz_kml = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        doc = ET.SubElement(raiz_kml, 'Document')

        nombre = ruta.find('u:info', ns).get('nombre')
        lista_coordenadas = []
        
        # Punto inicial
        localizacion = ruta.find('u:localizacion/u:coordenadas', ns)
        longitud = localizacion.get('longitud')
        latitud = localizacion.get('latitud')
        altitud = localizacion.get('altitud')
        lista_coordenadas.append(f'{longitud},{latitud},{altitud}')
        
        # Hitos
        hitos = ruta.findall('u:hito', ns)
        for j, hito in enumerate(hitos, start=1):
            nombre_hito = hito.get('nombreHito')
            coord = hito.find('u:coordenadas', ns)
            long = coord.get('longitud')
            lat = coord.get('latitud')
            alt = coord.get('altitud')
            añadirPlacemark(doc, f"{nombre} - Hito {j}: {nombre_hito}", long, lat, alt, 'relativeToGround')
            lista_coordenadas.append(f'{long},{lat},{alt}')

        lista_coordenadas_str = '\n'.join(lista_coordenadas)
        añadirLineString(doc, f"{nombre} - Recorrido", "1", "1", lista_coordenadas_str, 'relativeToGround', '#ff0000ff', "4")

        nombre = f'xml/kml/ruta{i}.kml'
        escribir(nombre, raiz_kml)
    
if __name__ == "__main__":
    main()  
