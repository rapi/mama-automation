import promisify from 'cypress-promise'

describe("spec.cy.js", () => {
    it("should visit", async () => {
        cy.viewport(1920, 1080) // Set viewport to 550px x 750px

        const items = await promisify(cy.task('convert'))
        //
        console.log(items)
        cy.visit(Cypress.env('URL'))
        cy.get('#UserName').type(Cypress.env('EMAIL'))
        cy.get('#Password').type(Cypress.env('PASSWORD'))
        cy.get('button[type="submit"]').click()
        cy.get('.btn-adauga-factura-inline').click()
        cy.wait(1000)
        for (const i in items) {

            const [date, order, company, name, phone, priceLiv, price, ramb, product, comment, address, judet, cityM, streetBucurest, street] = items[i]
            console.log({
                date,
                order,
                company,
                name,
                phone,
                priceLiv,
                price,
                ramb,
                product,
                comment,
                address,
                judet,
                cityM,
                streetBucurest,
                street
            })


            //id
            console.log(`Set date for ${name}`)
            cy.get(".tr-date-factura-noua > .td-factura-title > .txt-numar-factura-registru").type(order)


            //date
            console.log(`Set date for ${name}`)
            cy.get(".tr-date-factura-noua > .td-data-emitere > .font-weight-normal").type(date).type('{enter}')

            //client
            console.log(`Set name for ${name}`)
            cy.get('.td-date-client > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input').type(name)
            const data = await promisify(cy.get('.td-date-client').find(".tt-suggestion"));
            let isNewClient = true

            for (const i in data) {
                if (String(data[i].innerText).includes(judet) && !/\d/.test(String(data[i].innerText))) {
                    data[i].click()
                    isNewClient = false
                    break;

                }
            }

            if (isNewClient) {
                // add new client
                console.log(`Add new client for ${name}`)
                cy.get('.td-date-client > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input').clear().type("new")
                cy.get('.adauga-client-nou', {timeout: 100000}).should('exist');
                cy.get('.adauga-client-nou', {timeout: 10000}).click()
                cy.get('.modal-editare-client', {timeout: 100000}).should('exist');

                //name
                console.log(`Setup name for client ${name}`)
                cy.get("#Client_Denumire").type(name)

                //phone
                console.log(`Setup phone for client ${name}`)
                cy.get("#Client_Telefon1").type(phone)
                console.log(`Setup address for client ${name}`)
                cy.wait(1000)
                cy.get('#Client_Adresa1').type(address.split(',').splice(2).join(','))


                cy.get(".judet>span").click()
                cy.get(".select2-search__field").type(judet.trim().replaceAll(" ","-"))
                cy.get(".select2-results__option:last").click()
                await promisify(cy.get(".select2-search__field:first").type(cityM.trim().replaceAll(' ', '-')))
                cy.wait(1000)

                const elements=await promisify(cy.get('.select2-results__option'))
                for(const element of elements){
                    if(element.innerText!=="Selecteaza"){
                        cy.get(element).click()
                        break;
                    }
                }
                //address
                // cy.get('.close-modal-client:first').click()

                cy.get('.modal-editare-client', {timeout: 100000}).should('not.exist');

            }
            //product
            console.log(`Setup product for client ${name}`)
            const products = product
                .split(" )")
            products.splice(-1)
            for(const j in products){
                cy.wait(1500)
                const code=products[j].split(":")[0].trim()
                const price=(products[j]+")").match(/\(([^)]+)\)/g).pop().replace("(",'').split('-')[0].trim()
                const quantity=(products[j]+")").match(/\(([^)]+)\)/g).pop().replace(")",'').split('-')[1].trim()
                cy.get(".td-date-produs:last > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input").type(code)
                cy.get('.td-date-produs:last').find(".tt-suggestion",{timeout:100000}).should("exist")
                const suggentions = await promisify(cy.get('.td-date-produs:last').find(".tt-suggestion"));
                for (const el of suggentions){
                    console.log(el.innerText)

                    if(!String(el.innerText).includes("(")) {
                        console.log('click',el.innerText)

                        el.click()
                        break;
                    }
                }
                cy.wait(1000)

                cy.get(".td-cantitate:last .text-box").type(quantity,{force: true})
                cy.get(".td-um:last").type('buc').type("{enter}")
                cy.get(".td-total:last").type(String(parseFloat(quantity)*parseFloat(price)))
                cy.get(".td-tva:last").type("19")

                cy.get(".btn-adauga-factura-continut").click()
            }


            //livrare
            console.log(`Setup delivery for client ${name}`)
            cy.get(".td-date-produs:last > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input").type("serviciul de livrare")
            const suggentions = await promisify(cy.get('.td-date-produs:last').find(".tt-suggestion"));
            suggentions.each((i, element) => {
                if (element.innerText.includes('19')) {
                    element.click()
                }
            })
            cy.get('[placeholder="Total"]:last').type("18.00").type("{enter}")

            console.log(`Wait for save ${name}`)
            cy.scrollTo('top') // Scroll 'sidebar' to its bottom
            //
            // cy.get('.btn-close-factura').click()
            // cy.get('.btn-adauga-factura-inline').click()

            await promisify(cy.get('.td-date-produs:first > #scrollable-dropdown-menu > .twitter-typeahead > .tt-input', {timeout: 1000000}).should('have.value', ""))

            // console.log('gogo')
        }

    })
})