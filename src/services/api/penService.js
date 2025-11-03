import pensData from "@/services/mockData/pens.json";

class PenService {
  constructor() {
    this.pens = [...pensData];
    this.nextId = Math.max(...this.pens.map(pen => pen.Id)) + 1;
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.pens].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getById(id) {
    await this.delay();
    const pen = this.pens.find(p => p.Id === parseInt(id));
    return pen ? { ...pen } : null;
  }

  async getTrending() {
    await this.delay();
    return [...this.pens]
      .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
      .slice(0, 10);
  }

  async search(query) {
    await this.delay(200);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return this.pens.filter(pen => 
      pen.title.toLowerCase().includes(searchTerm) ||
      pen.author.name.toLowerCase().includes(searchTerm)
    );
  }

  async create(penData) {
    await this.delay();
    
    const newPen = {
      Id: this.nextId++,
      title: penData.title || "Untitled Pen",
      html: penData.html || "",
      css: penData.css || "",
      javascript: penData.javascript || "",
      thumbnail: null,
      author: {
        name: "Anonymous",
        avatar: null,
        id: "anonymous"
      },
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.pens.unshift(newPen);
    
    // Save to localStorage
    localStorage.setItem(`pen_${newPen.Id}`, JSON.stringify(newPen));
    
    return { ...newPen };
  }

  async update(id, penData) {
    await this.delay();
    
    const penIndex = this.pens.findIndex(p => p.Id === parseInt(id));
    if (penIndex === -1) return null;

    const updatedPen = {
      ...this.pens[penIndex],
      ...penData,
      updatedAt: new Date().toISOString()
    };

    this.pens[penIndex] = updatedPen;
    
    // Save to localStorage
    localStorage.setItem(`pen_${id}`, JSON.stringify(updatedPen));
    
    return { ...updatedPen };
  }

  async delete(id) {
    await this.delay();
    
    const penIndex = this.pens.findIndex(p => p.Id === parseInt(id));
    if (penIndex === -1) return false;

    this.pens.splice(penIndex, 1);
    localStorage.removeItem(`pen_${id}`);
    
    return true;
  }

  async likePen(id) {
    await this.delay(100);
    
    const pen = this.pens.find(p => p.Id === parseInt(id));
    if (!pen) return null;

    pen.likes += 1;
    pen.updatedAt = new Date().toISOString();
    
    return { ...pen };
  }

  async viewPen(id) {
    await this.delay(50);
    
    const pen = this.pens.find(p => p.Id === parseInt(id));
    if (!pen) return null;

    pen.views += 1;
    pen.updatedAt = new Date().toISOString();
    
    return { ...pen };
  }
}

export default new PenService();