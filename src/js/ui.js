export class ChatUI {
    constructor(list) {
        this.list = list;
        this.dateFormat = { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }
    }
    render(data) { // render chat messages to the DOM
        const html = `
            <li class="chat__list__message my-3">
                <div class="chat__list__message__content">
                    <span class="chat__list__message__meta__username">${data.username}</span>
                    ${data.message}
                </div>
                <div class="chat__list__message__meta">${data.created_at.toDate().toLocaleDateString('en-GB', this.dateFormat)}</span>
        `;
        this.list.innerHTML += html;
    }
    clear() { // clear the messages (when the user changes room)
        this.list.innerHTML = '';
    }
}