import pdfplumber


def extract_text(pdf_file):

    pages = []

    with pdfplumber.open(pdf_file) as pdf:

        for page in pdf.pages:

            text = page.extract_text()

            if text:
                pages.append(text)

    return "\n".join(pages)