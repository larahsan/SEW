import xml.etree.ElementTree as ET

arbol = ET.parse('xml/circuitoEsquema.xml')
raiz = arbol.getroot()

def obtenerCoordenadas():
    coordenadas = [] # Coordenadas de distancia y altitud

    for tramo in raiz.findall('{http://www.uniovi.es}tramo'):
        distancia = float(tramo.get('distancia'))
        altitud = float(tramo.find('{http://www.uniovi.es}coordenadas').get('altitud'))
        coordenadas.append((distancia, altitud))

    return coordenadas

def crearSvg(coordenadas, output_file):
    svg_header = '''<?xml version="1.0" encoding="UTF-8" ?>
                    <svg xmlns="http://www.w3.org/2000/svg" version="2.0">
                    <polyline points="'''

    puntos = []
    x = 10  # Coordenada inicial en el eje X
    puntos.append(f"{x}, 160")

    for dist, alt in coordenadas:
        x += dist // 10  # Escalar distancia
        y = 160 - alt*5  # Escalar altitud (invirtiendo Y para que vaya hacia arriba y haciendo más visibles las diferencias)
        puntos.append(f"{x},{y}")
    
    # Añadir el último punto para cerrar la polilínea al suelo
    puntos.append(f"{x}, 160 10,160")

    svg_estilo = '" style="fill:white;stroke:red;stroke-width:4" />\n</svg>'

    with open(output_file, 'w') as f:
        f.write(svg_header + "\n".join(puntos) + svg_estilo)

def main():
    coordenadas = obtenerCoordenadas()
    crearSvg(coordenadas, "altimetria.svg")

if __name__ == "__main__":
    main()
