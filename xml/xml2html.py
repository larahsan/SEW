import xml.etree.ElementTree as ET

class Html(object):

    def __init__(self):
        self.html = ET.Element('html', attrib={'lang': 'es'})
        self.head = ET.SubElement(self.html, 'head')

        ET.SubElement(self.head, 'meta', charset='UTF-8')
        ET.SubElement(self.head, 'meta', name='author', content='Lara Haya Santiago')
        ET.SubElement(self.head, 'meta', name='description', content='Documento con la información sobre el circuito Sachsenring del proyecto MotoGP-Desktop')
        ET.SubElement(self.head, 'meta', name='keywords', content='Circuito, Sachsenring')
        ET.SubElement(self.head, 'meta', name='viewport', content='width=device-width, initial-scale=1.0')
        ET.SubElement(self.head, 'title').text = 'MotoGP-Información del circuito Sachsenring'
        ET.SubElement(self.head, 'link', rel='stylesheet', type='text/css', href='../estilo/estilo.css')
        ET.SubElement(self.head, 'link', rel='stylesheet', type='text/css', href='../estilo/layout.css')

        self.body = ET.SubElement(self.html, 'body')
        self.header = ET.SubElement(self.body, 'header')
        self.main = ET.SubElement(self.body, 'main')

    def construirHtml(self):

        # ------ OBTENER FUENTE DE LA INFORMACIÓN ------
        arbol = ET.parse('xml/circuitoEsquema.xml')
        raiz = arbol.getroot()
        ns = {'u': 'http://www.uniovi.es'}

        # ------ OBTENER INFORMACIÓN ------

        # Información principal
        nombre = raiz.find('u:nombre', ns).text
        fechaCarrera25 = raiz.find('u:fechaCarrera25', ns).text
        horaEspInicio = raiz.find('u:horaEspInicio', ns).text
        numVueltas = raiz.find('u:numVueltas', ns).text
        localidad = raiz.find('u:localidad', ns).text
        pais = raiz.find('u:pais', ns).text
        patrocinador = raiz.find('u:patrocinador', ns).text

        # Longitud y anchura
        longitudCircuito_elemento = raiz.find('u:longitudCircuito', ns)
        longitudCircuito = longitudCircuito_elemento.text + " " + longitudCircuito_elemento.get('unidades')
        anchuraMedia_elemento = raiz.find('u:anchuraMedia', ns)
        anchuraMedia = anchuraMedia_elemento.text + " " + anchuraMedia_elemento.get('unidades')

        # Referencias y galería
        referencias = raiz.findall('u:referencias/u:referencia', ns)
        fotos = raiz.findall('u:foto', ns)
        videos = raiz.findall('u:video', ns)

        # Victoria y clasificados
        victoria = raiz.find('u:victoria', ns)
        vencedor = victoria.get("vencedor")
        tiempo = victoria.get("tiempo")
        clasificados = raiz.findall('u:clasificados/u:clasificado', ns)

        # ------ CONSTRUIR HTML ------

        ET.SubElement(self.header, 'h1').text = nombre

        info_section = ET.SubElement(self.main, 'section')
        ET.SubElement(info_section, 'h2').text = "Información general"

        ET.SubElement(info_section, 'p').text = f"Fecha de la carrera: {fechaCarrera25}"
        ET.SubElement(info_section, 'p').text = f"Hora de inicio (España): {horaEspInicio}"
        ET.SubElement(info_section, 'p').text = f"Número de vueltas: {numVueltas}"
        ET.SubElement(info_section, 'p').text = f"Localidad: {localidad} ({pais})"
        ET.SubElement(info_section, 'p').text = f"Patrocinador: {patrocinador}"
        ET.SubElement(info_section, 'p').text = f"Longitud del circuito: {longitudCircuito}"
        ET.SubElement(info_section, 'p').text = f"Anchura media: {anchuraMedia}"

        victoria_section = ET.SubElement(self.main, 'section')
        ET.SubElement(victoria_section, 'h2').text = "Victoria"
        ET.SubElement(victoria_section, 'p').text = f"Vencedor: {vencedor}"
        ET.SubElement(victoria_section, 'p').text = f"Tiempo: {tiempo}"

        clasif_section = ET.SubElement(self.main, 'section')
        ET.SubElement(clasif_section, 'h2').text = "Clasificados"
        lista = ET.SubElement(clasif_section, 'ol')
        for c in clasificados:
            ET.SubElement(lista, 'li').text = c.text

        multimedia_section = ET.SubElement(self.main, 'section')
        ET.SubElement(multimedia_section, 'h2').text = "Multimedia"
        ruta_fotos = "../multimedia/imagenes/"
        ruta_videos = "../multimedia/videos/"

        for f in fotos:
            ET.SubElement(multimedia_section, 'img', src=ruta_fotos+f.text, alt=f"Foto del circuito {nombre}")

        for v in videos:
            ET.SubElement(multimedia_section, 'video', src=ruta_videos+v.text, controls="")

        ref_section = ET.SubElement(self.main, 'section')
        ET.SubElement(ref_section, 'h2').text = "Referencias"
        for r in referencias:
            enlace = ET.SubElement(ref_section, 'a', href=r.text)
            enlace.text = r.text

    def escribir(self, nombreArchivoHTML):
        arbol = ET.ElementTree(self.html)
        ET.indent(arbol)
        with open(nombreArchivoHTML, "wb") as f:
            f.write(b"<!DOCTYPE html>\n")
            arbol.write(f, encoding='utf-8', method='html')

def main():
    html = Html()
    html.construirHtml()
    html.escribir("xml/InfoCircuito.html")

if __name__ == "__main__":
    main()