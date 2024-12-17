import xml.etree.ElementTree as ET

arbol = ET.parse('xml/circuitoEsquema.xml')
raiz = arbol.getroot()

raiz_kml = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
doc = ET.SubElement(raiz_kml, 'Document')

def añadirPlacemark(nombre,long,lat,alt, modoAltitud):
    pm = ET.SubElement(doc,'Placemark')
    ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
    punto = ET.SubElement(pm,'Point')
    ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
    ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

def añadirLineString(nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
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

def escribir(nombreArchivoKML):
    arbol_kml = ET.ElementTree(raiz_kml)
    arbol_kml.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def main():
    
    tramos = raiz.findall('{http://www.uniovi.es}tramo')

    lista_coordenadas = []
    for tramo in tramos:
        coord = tramo.find('{http://www.uniovi.es}coordenadas')
        longitud = coord.get('longitud')
        latitud = coord.get('latitud')
        altitud = coord.get('altitud')
        lista_coordenadas.append(f'{longitud},{latitud},{altitud}')
        nombre = f'Sector {tramo.get("numSector")}'
        añadirPlacemark(nombre, longitud, latitud, altitud, 'relativeToGround')

    lista_coordenadas_str = '\n'.join(lista_coordenadas)

    añadirLineString("Ruta del circuito", "1", "1", lista_coordenadas_str, 'relativeToGround', '#ff0000ff', "5")
    
    escribir("circuito.kml")
    
if __name__ == "__main__":
    main()  
