import xml.etree.ElementTree as ET

arbol = ET.parse('xml/rutasEsquema.xml')
raiz = arbol.getroot()
ns = {'u': 'http://www.uniovi.es'} 

def obtenerCoordenadas():

    color = ['red', 'blue', 'green']
    for idx, ruta in enumerate(raiz.findall('u:ruta', ns), start=1):
        nombre_ruta = ruta.find('u:info', ns).get('nombre')
        coordenadas_por_ruta = [('Inicio', 0, float(ruta.find('u:localizacion/u:coordenadas', ns).get('altitud')))]

        for hito in ruta.findall('u:hito', ns):
            distancia = float(hito.find('u:distanciaDesdeHito', ns).get('unidades'))
            altitud = float(hito.find('u:coordenadas', ns).get('altitud'))
            nombreHito = hito.get('nombreHito')
            coordenadas_por_ruta.append((nombreHito, distancia, altitud))

        crearSvg(nombre_ruta, coordenadas_por_ruta, idx, color[idx-1])

def crearSvg(nombre_ruta, coordenadas_por_ruta, idx, color):
    svg_header = '''<?xml version="1.0" encoding="UTF-8"?>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">'''

    contenido_svg = [svg_header]
    x = 10
    puntos = [f"{x},160"]
    contenido_svg.append(f'<text x="10" y="20" font-size="20" fill="black">{nombre_ruta}</text>')
    contenido_svg.append('<g transform="translate(0,30)">')

    x_actual = x
    for i, (nombreHito, dist, alt) in enumerate(coordenadas_por_ruta):
        x_actual += dist // 18
        y_actual = 160 - alt / 15
        puntos.append(f"{x_actual},{y_actual}")
        contenido_svg.append(f'<circle cx="{x_actual}" cy="{y_actual}" r="3" fill="{color}"/>')
        offset = 20 if i % 2 == 0 else 40
        contenido_svg.append(f'<text x="{x_actual}" y="{y_actual - offset}" font-size="10" fill="black">{i}: {nombreHito}</text>')

    puntos.append(f"{x_actual},160 10,160")
    puntos_str = " ".join(puntos)
    contenido_svg.append(f'<polyline points="{puntos_str}" style="fill:white;stroke:{color};stroke-width:2" />')
    contenido_svg.append('</g>\n</svg>')

    output_file = f'xml/svg/altimetria{idx}.svg'
    with open(output_file, 'w', encoding="utf-8") as f:
        f.write('\n'.join(contenido_svg))

if __name__ == "__main__":
    obtenerCoordenadas()
