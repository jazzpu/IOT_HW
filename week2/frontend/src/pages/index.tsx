import Layout from "../components/layout";
import cafeBackgroundImage from "../assets/images/bg-cafe-1.jpg";
import ajPanwitImage from "../assets/images/aj-panwit.jpg";
import coffeeImage from "../assets/images/coffee-1.jpg";

export default function HomePage() {
  return (
    <Layout>
      <section
        className="h-[500px] w-full text-white bg-orange-800 bg-cover bg-blend-multiply flex flex-col justify-center items-center px-4 text-center"
        style={{
          backgroundImage: `url(${cafeBackgroundImage})`,
        }}
      >
        <h1 className="text-5xl mb-2">ยินดีต้อนรับสู่ IoT Library & Cafe</h1>
        <h2>ร้านกาแฟที่มีหนังสืออยู่นิดหน่อยให้คุณได้อ่าน</h2>
      </section>

      <section className="container mx-auto py-8">
        <h1>เกี่ยวกับเรา</h1>

        <div className="grid grid-cols-3 gap-4">
          <p className="text-right col-span-2">
            Jasmine’s Café is a cozy neighborhood spot for specialty coffee, fresh pastries, and simple brunch. Sunlit tables, free Wi-Fi, and plenty of outlets make it ideal for study sessions or catch-ups. We source beans responsibly and bake daily—come dine in, order ahead, or grab and go.
          </p>

          <div>
            <img src={ajPanwitImage} alt="Panwit Tuwanut" className="h-full w-full object-cover" />
          </div>
        </div>
        <p className="text-right mt-8">
          Jasmine Alysha Theseira 66070246
          {/* TODO: ชื่อของตนเอง, รหัสประจำตัวนักศึกษา และแนะนำคาเฟ่นี้ต่ออีกสักหน่อย + ใส่รูปของตนเอง (ไม่จำเป็นหากไม่สะดวกใจใส่รูป) */}
          <br />
          Welcome to Jasmine’s Café, a bright, laid-back corner where good coffee and easy conversation come first. Sunlight spills across wooden tables, the grinders hum softly, and the room smells like fresh espresso and butter from the morning bakes. Our baristas pull classic shots and slow, syrupy pour-overs, but we also keep things playful with seasonal signatures—think orange-blossom iced lattes, salted caramel cold foam, and a rotating single-origin filter. Non-coffee friends are covered with matcha, chai, and small-batch teas. The pastry case changes daily: croissants that shatter, banana bread glazed with brown butter, and a couple of plant-based options that don’t feel like a compromise. Brunch is simple and satisfying—sourdough toasts, soft scrambles, salads with crisp herbs, and a hearty sandwich or two. There’s reliable Wi-Fi, plenty of outlets, and music that stays in the background so you can study, sketch, or just sit. We source beans from responsible roasters, compost our grounds, and nudge waste down with reusable cups and minimal packaging. Come early for a quiet table, swing by at lunch for something warm, or drop in late afternoon for a sweet pick-me-up; whichever moment you choose, we’ll meet you with a smile and a cup that was worth the trip.
        </p>
      </section>

      <section className="w-full flex justify-center">
        <img src={coffeeImage} alt="Coffee" className="w-full" />
      </section>
    </Layout>
  );
}
