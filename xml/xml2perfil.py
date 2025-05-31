import xml.etree.ElementTree as ET

arbol = ET.parse('xml/rutasEsquema.xml')
raiz = arbol.getroot()
ns = {'u': 'http://www.uniovi.es'} 

def obtenerCoordenadas():
    coordenadas = []

    for ruta in raiz.findall('u:ruta', ns):
        nombre = ruta.find('u:info', ns).get('nombre')
        coordenadas_por_ruta = [('Inicio', 0, float(ruta.find('u:localizacion/u:coordenadas', ns).get('altitud')))]

        for hito in ruta.findall('u:hito', ns):
            dist = hito.find('u:distanciaDesdeHito', ns)
            distancia = float(dist.get('unidades'))

            alt = hito.find('u:coordenadas', ns)
            altitud = float(alt.get('altitud'))

            nombreHito = hito.get('nombreHito')
            coordenadas_por_ruta.append((nombreHito, distancia, altitud))

        coordenadas.append((nombre, coordenadas_por_ruta))

    return coordenadas

def crearSvg(coordenadas_rutas, output_file):
    svg_header = '''<?xml version="1.0" encoding="UTF-8"?>
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">'''

    colores = ['red', 'blue', 'green']
    contenido_svg = [svg_header]
    altura_por_ruta = 200

    for idx, (nombre, coordenadas) in enumerate(coordenadas_rutas):
        offset_y = idx * altura_por_ruta
        puntos = []
        x = 10
        puntos.append(f"{x},160")

        color = colores[idx % len(colores)]

        contenido_svg.append(f'<text x="10" y="{offset_y + 20}" font-size="20" fill="black">{nombre}:</text>')
        contenido_svg.append(f'<g transform="translate(0,{offset_y + 30})">')

        x_actual = x
        for i, (nombreHito, dist, alt) in enumerate(coordenadas):
            x_actual += dist // 18
            y_actual = 160 - alt / 15
            puntos.append(f"{x_actual},{y_actual}")

            contenido_svg.append(f'<circle cx="{x_actual}" cy="{y_actual}" r="3" fill="{color}"/>')
            offset = 20 if i % 2 == 0 else 40  # Evitar que se superpongan los textos
            contenido_svg.append(f'<text x="{x_actual}" y="{y_actual - offset}" font-size="10" fill="black">{i}: {nombreHito}</text>')

        puntos.append(f"{x_actual},160 10,160")
        puntos_str = " ".join(puntos)

        contenido_svg.append(f'<polyline points="{puntos_str}" style="fill:white;stroke:{color};stroke-width:2" />')
        contenido_svg.append('</g>')

    contenido_svg.append('</svg>')

    with open(output_file, 'w', encoding="utf-8") as f:
        f.write('\n'.join(contenido_svg))

if __name__ == "__main__":
    rutas = obtenerCoordenadas()
    crearSvg(rutas, "xml/altimetria.svg")
